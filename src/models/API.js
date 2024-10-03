import axios from "axios";
import { MTGCard } from "models/MTGTypes";

class API {
  static async getCollection(client, identifiers) {
    let cards = [];
    let notFound = [];

    const identifierChunks = chunk(identifiers, 75);

    await Promise.all(
      identifierChunks.map(async (chunk) => {
        const collectionRequest = { identifiers: chunk };
        const response = await client.post(
          "cards/collection?pretty=true",
          collectionRequest
        );
        const result = response.data;
        notFound.push(...result.not_found);
        cards.push(...result.data);
      })
    );

    return { object: "list", not_found: notFound, data: cards };
  }

  static async getAllPrintings(client, printsSearchUri) {
    const response = await client.get(printsSearchUri);

    const artPrintings = [];
    const cardData = [];
    let dualsided = false;

    for (const card of response.data.data) {
      if (card.layout === "transform" || card.layout === "modal_dfc") {
        dualsided = true;
      }

      const cardDetails = await client.get(card.uri);

      const cardFaces = cardDetails.data.card_faces || [];
      if (cardFaces.length > 0) {
        const imageUris = cardFaces
          .map((face) => face.image_uris?.png)
          .filter((uri) => uri);
        artPrintings.push(...imageUris);
      } else if (cardDetails.data.image_uris) {
        const imageUri = cardDetails.data.image_uris.png;
        if (imageUri) {
          artPrintings.push(imageUri);
        }
      }

      cardData.push(card);
    }
    return { artPrintings, cardData, dualsided };
  }

  static async getAllArtPrintingsForDeck(deck) {
    return artPrintings;
  }

  static async autocompleteCardSearch(query) {
    const client = axios.create({
      baseURL: "https://api.scryfall.com/",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const response = await client.get(
        `cards/autocomplete?q=${encodeURIComponent(query)}`
      );
      return response.data.data; // This will be an array of card names
    } catch (error) {
      console.error("Error in autocomplete search:", error);
      return []; // Return an empty array if there's an error
    }
  }

  static async loadSingleCardDetails(cardName) {
    const client = axios.create({
      baseURL: "https://api.scryfall.com/",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let card = cardName.includes(" // ")
      ? cardName.split(" // ")[0]
      : cardName;

    try {
      const response = await client.get(
        `cards/named?fuzzy=${encodeURIComponent(card)}`
      );
      return new MTGCard(response.data, "Main");
    } catch (error) {
      console.error(`Error loading details for card: ${card}`, error);
      return null;
    }
  }
}

function chunk(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

export default API;
