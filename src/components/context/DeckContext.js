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
          alert("No deck found. Please load a deck first.");
        }
      }
      setLoading(false);
    };

    loadDeck();
  }, [location]);

  useEffect(() => {
    localStorage.setItem("cachedDeck", JSON.stringify(deck));
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

  const getTotalMainZoneCards = () => {
    return deck
      .filter((card) => card.zone === "Main")
      .reduce((total, card) => total + card.quantity, 0);
  };

  return (
    <DeckContext.Provider
      value={{
        deck,
        setDeck,
        loading,
        updateQuantity,
        addCard,
        getTotalMainZoneCards,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => useContext(DeckContext);
