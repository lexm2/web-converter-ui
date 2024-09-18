import XMLWriter from "./XMLWriter";

class MTGCard {
  constructor(cardData) {
    this.id = cardData.id;
    this.name = cardData.name;
    this.manaCost = cardData.mana_cost;
    this.cmc = cardData.cmc;
    this.typeLine = cardData.type_line;
    this.oracleText = cardData.oracle_text;
    this.power = cardData.power;
    this.toughness = cardData.toughness;
    this.colors = cardData.colors;
    this.setName = cardData.set_name;
    this.rarity = cardData.rarity;
    this.imageUris = cardData.image_uris;
  }
}

class MTGDeck {
  constructor(name) {
    this.name = name;
    this.cards = [];
    this.cardCount = 0;
  }

  addCard(card, quantity = 1) {
    for (let i = 0; i < quantity; i++) {
      this.cards.push(card);
      this.cardCount++;
    }
  }

  removeCard(cardId, quantity = 1) {
    let removedCount = 0;
    this.cards = this.cards.filter((card) => {
      if (card.id === cardId && removedCount < quantity) {
        removedCount++;
        this.cardCount--;
        return false;
      }
      return true;
    });
  }

  getCardCount() {
    return this.cardCount;
  }

  writeXML() {
    const xw = new XMLWriter("UTF-8", "1.0");
    xw.formatting = "indented";
    xw.indentChar = " ";
    xw.indentation = 2;

    xw.writeStartDocument(true);
    xw.writeStartElement("deck");
    xw.writeAttributeString("game", "a6c8d2e8-7cd8-11dd-8f94-e62b56d89593");

    // Group cards by type
    const cardsByType = this.cards.reduce((acc, card) => {
      const type = card.typeLine.split(" ")[0]; // Use the first word of typeLine as the section name
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(card);
      return acc;
    }, {});

    // Write sections
    for (const [type, cards] of Object.entries(cardsByType)) {
      xw.writeStartElement("section");
      xw.writeAttributeString("name", type);

      // Count occurrences of each unique card
      const cardCounts = cards.reduce((acc, card) => {
        acc[card.id] = (acc[card.id] || 0) + 1;
        return acc;
      }, {});

      // Write cards
      for (const [cardId, count] of Object.entries(cardCounts)) {
        const card = cards.find((c) => c.id === cardId);
        xw.writeStartElement("card");
        xw.writeAttributeString("qty", count.toString());
        xw.writeAttributeString("id", card.id);
        xw.writeString(card.name);
        xw.writeEndElement();
      }

      xw.writeEndElement(); // Close section
    }

    xw.writeEndElement(); // Close deck
    xw.writeEndDocument();

    const xml = xw.flush();
    xw.close();

    this.downloadStringAsFile(xml, `${this.name}.od8`);
  }

  downloadStringAsFile(stringData, defaultFilename) {
    const userFilename = prompt("Enter a filename:", defaultFilename);
    if (!userFilename) return; // User cancelled the prompt

    const filename = userFilename.endsWith(".od8")
      ? userFilename
      : `${userFilename}.od8`;
    const blob = new Blob([stringData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    link.click();

    URL.revokeObjectURL(url);
  }

  parseDeckList(deckListString) {
    const lines = deckListString.split("\n");
    const cards = new Map();
    let isFirstLine = true;
    let hasSectionNames = true;
    let sectionName = "Main";

    const sectionHeading = /^(\/\/)?\s*(Main|Sideboard|Command Zone|Planes\/Schemes|Maybeboard)\s*([\(|\[].*?[\)|\]])?/;
    const cardDetails = /^(SB:\s*?)?(\d+)\s*([\(|\[].*?[\)|\]])?\s*([^\(|\[]*)([\(|\[].*?[\)|\]])?\s*(\d+)?\s*(\([F|f]\))?/;
    const setSymbol = /^[\(\[](.+)[\)\]]/;

    for (const line of lines) {
      const trimLine = line.trim();
      let set = null;

      if (sectionHeading.test(trimLine)) {
        if (isFirstLine) isFirstLine = false;
        sectionName = sectionHeading.exec(trimLine)[2];
      } else if (cardDetails.test(trimLine)) {
        if (isFirstLine) {
          hasSectionNames = false;
          isFirstLine = false;
        }

        let processedLine = trimLine;
        if (trimLine.startsWith("SB:")) {
          sectionName = "Sideboard";
          processedLine = trimLine.replace("SB:", "").trim();
        }

        const match = cardDetails.exec(processedLine);
        const cardName = match[4].split(" // ")[0].trim();
        let qty = parseInt(match[2]);

        if (setSymbol.test(match[3]))
          set = setSymbol.exec(match[3])[1].toLowerCase();
        else if (setSymbol.test(match[5]))
          set = setSymbol.exec(match[5])[1].toLowerCase();

        const cardKey = { cardName, set, sectionName };

        if (cards.has(cardKey)) {
          qty += cards.get(cardKey);
        }
        cards.set(cardKey, qty);
      } else if (trimLine === "" && !hasSectionNames) {
        const zoneIndex = Zones.indexOf(sectionName) + 1;
        if (zoneIndex < Zones.length) sectionName = Zones[zoneIndex];
      } else if (trimLine.startsWith("//") || trimLine === "") {
        // comment line or empty line
      } else {
        if (isFirstLine) {
          hasSectionNames = false;
          isFirstLine = false;
        }

        if (!hasSectionNames) {
          const cardName = trimLine.split(" // ")[0];
          const cardKey = { cardName, set, sectionName };
          cards.set(cardKey, 1);
        }
      }
    }

    return cards;
  }

  importDeckList(deckListString) {
    const parsedCards = this.parseDeckList(deckListString);
    this.cards = [];
    this.cardCount = 0;

    for (const [cardKey, quantity] of parsedCards) {
      const cardData = {
        id: cardKey.cardName, // Using cardName as id for simplicity
        name: cardKey.cardName,
        set_name: cardKey.set,
        type_line: cardKey.sectionName, // Using sectionName as type_line for simplicity
      };
      const card = new MTGCard(cardData);
      this.addCard(card, quantity);
    }
  }

  async loadCardDetails() {
    const client = axios.create({
      baseURL: "https://api.scryfall.com/",
    });

    const identifiers = this.cards.map((card) => ({ name: card.name }));
    const collection = await API.getCollection(client, identifiers);

    collection.data.forEach((cardData) => {
      const card = this.cards.find((c) => c.name === cardData.name);
      if (card) {
        card.id = cardData.id;
        card.name = cardData.name;
        card.manaCost = cardData.mana_cost;
        card.cmc = cardData.cmc;
        card.typeLine = cardData.type_line;
        card.oracleText = cardData.oracle_text;
        card.power = cardData.power;
        card.toughness = cardData.toughness;
        card.colors = cardData.colors;
        card.setName = cardData.set_name;
        card.rarity = cardData.rarity;
        card.imageUris = cardData.image_uris;
      }
    });
  }
}

export default MTGDeck;
