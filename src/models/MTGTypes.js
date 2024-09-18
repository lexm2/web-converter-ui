import axios from "axios";
import API from "./API";

class MTGCard {
  constructor(cardData, sectionName) {
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
    this.zone = sectionName;
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

  async importDeckList(deckListString) {
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
      const card = new MTGCard(cardData, cardKey.sectionName); // Pass zone to MTGCard
      this.addCard(card, quantity);
    }

    await this.loadCardDetails();
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
}

export { MTGCard, MTGDeck };
