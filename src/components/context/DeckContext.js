import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "models/API";

const DeckContext = createContext();

export const DeckProvider = ({ children }) => {
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadDeck = async () => {
      const loadedDeck = location.state?.deck;
      if (loadedDeck) {
        console.log("Loaded deck from local storage:", loadedDeck);
        setDeck(loadedDeck);
      } else {
        const cachedDeck = localStorage.getItem("cachedDeck");
        if (cachedDeck) {
          const parsedDeck = JSON.parse(cachedDeck);
          setDeck(parsedDeck);
        } else {
          console.log("No deck found. Please load a deck first.");
        }
      }
      setLoading(false);
    };

    loadDeck();
  }, [location]);

  useEffect(() => {
    if (deck.length > 0) {
      localStorage.setItem("cachedDeck", JSON.stringify(deck));
    }
  }, [deck]);

  const updateQuantity = (cardId, zone, delta) => {
    const updatedDeck = deck.map((card) => {
      if (card.id === cardId && card.zone === zone) {
        return { ...card, quantity: Math.max(1, card.quantity + delta) };
      }
      return card;
    });
    setDeck(updatedDeck);
  };

  const addCard = async (cardName) => {
    const cardDetails = await API.loadSingleCardDetails(cardName);
    if (cardDetails) {
      setDeck((prevDeck) => [...prevDeck, { ...cardDetails, quantity: 1 }]);
    }
  };

  const removeCard = (oracleId) => {
    setDeck((prevDeck) =>
      prevDeck.filter((card) => card.oracle_id !== oracleId)
    );
  };

  const getTotalMainZoneCards = () => {
    return deck
      .filter((card) => card.zone === "Main")
      .reduce((total, card) => total + card.quantity, 0);
  };

  const organizeCardsByZone = (deck) => {
    const zones = {
      Main: [],
      Sideboard: [],
      "Command Zone": [],
      "Planes/Schemes": [],
      Maybeboard: [],
    };

    deck?.forEach((card) => {
      if (zones[card.zone]) {
        zones[card.zone].push(card);
      }
    });

    return zones;
  };

  const analyzeDeckLegality = (mainDeck, totalCards, highestQuantityCard) => {
    const formatRules = {
      standard: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null },
      brawl: { maxCopies: 1, minDeckSize: 60, maxDeckSize: 60 },
      pioneer: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null },
      modern: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null },
      legacy: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null },
      vintage: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null },
      commander: { maxCopies: 1, minDeckSize: 100, maxDeckSize: 100 },

      // alchemy: { maxCopies: 4, minDeckSize: 30 },
      // duel: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // explorer: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // future:  { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // gladiator: { maxCopies: 1, minDeckSize: 100, maxDeckSize: null },
      // historic: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // oathbreaker: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // oldschool: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // pauper: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // paupercommander: { maxCopies: 1, minDeckSize: 100 },
      // penny: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // predh: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // premodern: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
      // standardbrawl: { maxCopies: 1, minDeckSize: 60, maxDeckSize: null},
      // timeless: { maxCopies: 4, minDeckSize: 60, maxDeckSize: null},
    };

    const legalFormats = mainDeck.reduce((acc, card) => {
      Object.entries(card.legalities).forEach(([format, legality]) => {
        if (legality === "legal") {
          acc[format] = (acc[format] || 0) + 1;
        }
      });
      return acc;
    }, {});

    const deckLegality = Object.entries(formatRules).reduce(
      (acc, [format, rules]) => {
        const isLegalSize = rules.maxDeckSize
          ? totalCards >= rules.minDeckSize && totalCards <= rules.maxDeckSize
          : totalCards >= rules.minDeckSize;

        acc[format] = {
          isLegal:
            isLegalSize && highestQuantityCard.quantity <= rules.maxCopies,
          maxCopiesAllowed: rules.maxCopies,
          minDeckSize: rules.minDeckSize,
          maxDeckSize: rules.maxDeckSize || "unlimited",
          currentDeckSize: totalCards,
          highestCopyCount: highestQuantityCard.quantity,
          cardWithMostCopies: highestQuantityCard.name,
        };
        return acc;
      },
      {}
    );

    const fullyLegalFormats = Object.entries(legalFormats)
      .filter(([format, count]) => count === mainDeck.length)
      .map(([format]) => format);

    return {
      deckLegality,
      fullyLegalFormats,
    };
  };

  return (
    <DeckContext.Provider
      value={{
        deck,
        setDeck,
        loading,
        updateQuantity,
        addCard,
        removeCard,
        getTotalMainZoneCards,
        organizeCardsByZone,
        analyzeDeckLegality,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => useContext(DeckContext);
