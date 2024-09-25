import axios from "axios";
import API from "./API";
import XMLWriter from "./XMLWriter";
import CryptoJS from "crypto-js";

const Zones = [
  "Main",
  "Sideboard",
  "Command Zone",
  "Planes/Schemes",
  "Maybeboard",
];

// Module-level variable to store cached cards
let cachedCards = null;
let cardsHash = null;

// Cache for card prints
const cardPrintsCache = {};

class MTGCard {
  constructor(cardData, sectionName, quantity) {
    this.object = cardData.object;
    this.id = cardData.id;
    this.oracleId = cardData.oracle_id;
    this.multiverseIds = cardData.multiverse_ids;
    this.mtgoId = cardData.mtgo_id;
    this.arenaId = cardData.arena_id;
    this.tcgplayerId = cardData.tcgplayer_id;
    this.cardmarketId = cardData.cardmarket_id;
    this.name = cardData.name;
    this.lang = cardData.lang;
    this.releasedAt = cardData.released_at;
    this.uri = cardData.uri;
    this.scryfallUri = cardData.scryfall_uri;
    this.layout = cardData.layout;
    this.highresImage = cardData.highres_image;
    this.imageStatus = cardData.image_status;
    this.cmc = cardData.cmc;
    this.typeLine = cardData.type_line;
    this.colorIdentity = cardData.color_identity;
    this.keywords = cardData.keywords;
    this.cardFaces = cardData.card_faces;
    this.allParts = cardData.all_parts;
    this.legalities = cardData.legalities;
    this.games = cardData.games;
    this.reserved = cardData.reserved;
    this.foil = cardData.foil;
    this.nonfoil = cardData.nonfoil;
    this.finishes = cardData.finishes;
    this.oversized = cardData.oversized;
    this.promo = cardData.promo;
    this.reprint = cardData.reprint;
    this.variation = cardData.variation;
    this.setId = cardData.set_id;
    this.set = cardData.set;
    this.setName = cardData.set_name;
    this.setType = cardData.set_type;
    this.setUri = cardData.set_uri;
    this.setSearchUri = cardData.set_search_uri;
    this.scryfallSetUri = cardData.scryfall_set_uri;
    this.rulingsUri = cardData.rulings_uri;
    this.printsSearchUri = cardData.prints_search_uri;
    this.collectorNumber = cardData.collector_number;
    this.digital = cardData.digital;
    this.rarity = cardData.rarity;
    this.artist = cardData.artist;
    this.artistIds = cardData.artist_ids;
    this.borderColor = cardData.border_color;
    this.frame = cardData.frame;
    this.frameEffects = cardData.frame_effects;
    this.securityStamp = cardData.security_stamp;
    this.fullArt = cardData.full_art;
    this.textless = cardData.textless;
    this.booster = cardData.booster;
    this.storySpotlight = cardData.story_spotlight;
    this.edhrecRank = cardData.edhrec_rank;
    this.preview = cardData.preview;
    this.prices = cardData.prices;
    this.relatedUris = cardData.related_uris;
    this.purchaseUris = cardData.purchase_uris;
    this.zone = sectionName;
    this.quantity = quantity;
  }
}

class MTGDeck {
  constructor(name) {
    this.name = name;
    this.cards = [];
    this.cardCount = 0;
  }

  addCard(card, quantity = 1) {
    this.cards.push(card);
    this.cardCount += quantity;
    this.invalidateCache();
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
    this.invalidateCache();
  }

  getCardCount() {
    return this.cardCount;
  }

  invalidateCache() {
    cachedCards = null;
    cardsHash = null;
  }

  async loadCardDetails() {
    const client = axios.create({
      baseURL: "https://api.scryfall.com/",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const identifiers = this.cards.map((card) => {
      const cardName = card.name.includes(" // ")
        ? card.name.split(" // ")[0]
        : card.name;

      if (card.name.includes("/")) {
        cardName = card.name.split("/")[0];
      }
      return { name: cardName };
    });

    const collection = await API.getCollection(client, identifiers);
    console.log(collection);
    this.cards = collection.data
      .map((cardData) => {
        const existingCard = this.cards.find(
          (c) =>
            c.name.includes(cardData.name) || cardData.name.includes(c.name)
        );

        if (existingCard) {
          // Preserve the quantity field
          const card = new MTGCard(cardData, existingCard.zone);

          card.quantity = existingCard.quantity;
          return card;
        } else {
          console.log(`Card not found: ${cardData.name}`);
          return null;
        }
      })
      .filter((card) => card !== null);

    // Assign the cache only after the request is done
    localStorage.setItem("cachedDeck", JSON.stringify(this.cards));
    console.log(JSON.parse(localStorage.getItem("cachedDeck")));
    cachedCards = this.cards;
    return this.cards;
  }
}

async function getCardPrints(card) {
  // Check if the card prints are already in the cache
  if (cardPrintsCache[card.id]) {
    console.log("Returning cached prints for card:", card.name);
    return cardPrintsCache[card.id];
  }

  const client = axios.create({
    baseURL: "https://api.scryfall.com/",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await API.getAllPrintings(client, card.printsSearchUri);

  // Store the response in the cache
  cardPrintsCache[card.id] = response;

  return response.artPrintings;
}

function hashDeck(deck) {
  const cardsString = JSON.stringify(
    deck.cards.map((card) => ({
      name: card.name.substring(0, 3),
      quantity: card.quantity,
      zone: card.zone,
    }))
  );
  return CryptoJS.MD5(cardsString).toString();
}

async function importDeckList(deckListString) {
  const parsedCards = parseDeckList(deckListString);
  const newDeck = new MTGDeck("New Deck");

  for (const [cardKey, quantity] of parsedCards) {
    const cardData = {
      id: cardKey.cardName,
      name: cardKey.cardName,
      set_name: cardKey.set,
      zone: cardKey.sectionName,
      quantity: quantity,
    };
    const card = new MTGCard(cardData, cardKey.sectionName, quantity);
    newDeck.addCard(card, quantity);
  }

  const newHash = hashDeck(newDeck);

  if (cardsHash === newHash) {
    return cachedCards;
  }

  await newDeck.loadCardDetails();
  cardsHash = newHash;
  return newDeck.cards;
}

function parseDeckList(deckListString) {
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

async function writeXML(deck) {
  const xw = new XMLWriter("UTF-8", "1.0");
  xw.formatting = "indented";
  xw.indentChar = " ";
  xw.indentation = 2;

  xw.writeStartDocument(true);
  xw.writeStartElement("deck");
  xw.writeAttributeString("game", "a6c8d2e8-7cd8-11dd-8f94-e62b56d89593");

  // Group cards by zone
  const cardsByZone = deck.cards.reduce((acc, card) => {
    if (!acc[card.zone]) {
      acc[card.zone] = [];
    }
    acc[card.zone].push(card);
    return acc;
  }, {});

  // Write sections
  for (const [zone, cards] of Object.entries(cardsByZone)) {
    xw.writeStartElement("section");
    xw.writeAttributeString("name", zone);

    // Count occurrences of each unique card
    const cardCounts = cards.reduce((acc, card) => {
      acc[card.id] = (acc[card.id] || 0) + card.quantity;
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

  function downloadStringAsFile(stringData, defaultFilename) {
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

  downloadStringAsFile(xml, `${deck.name}.od8`);
}

export {
  MTGCard,
  MTGDeck,
  importDeckList,
  parseDeckList,
  writeXML,
  getCardPrints,
};
