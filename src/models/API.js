import axios from 'axios';

class API {
  static async getCollection(client, identifiers) {
    let cards = [];
    let notFound = [];

    const identifierChunks = chunk(identifiers, 75);

    await Promise.all(identifierChunks.map(async (chunk) => {
      const collectionRequest = { identifiers: chunk };
      const response = await client.post('cards/collection?pretty=true', collectionRequest);
      const result = response.data;
      notFound.push(...result.not_found);
      cards.push(...result.data);
    }));

    return { object: 'list', not_found: notFound, data: cards };
  }

  static async getAllPrintings(client, printsSearchUri) {
    const response = await client.get(printsSearchUri);
    return response.data;
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
