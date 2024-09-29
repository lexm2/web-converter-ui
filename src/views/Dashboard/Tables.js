import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Flex,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Text,
  Spinner,
  Button,
  Collapse,
  IconButton,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { getCardPrints, getPrintData } from "models/MTGTypes.js";
import Carousel from "./Carousel"; // Import the new Carousel component

// Global variable to store the carousel index
let globalCarouselIndex = 0;

function Tables() {
  const [deck, setDeck] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [loadingPrints, setLoadingPrints] = useState(false);
  const [openZones, setOpenZones] = useState({
    Main: true,
    Sideboard: true,
    "Command Zone": true,
    "Planes/Schemes": true,
    Maybeboard: true,
  });
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedCardImages, setSelectedCardImages] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const bgButton = useColorModeValue("brand.200", "brand.700");
  const bgButtonHover = useColorModeValue("brand.300", "brand.800");

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
        console.log("Deck updated:", card.quantity + delta);
        return { ...card, quantity: Math.max(1, card.quantity + delta) };
      }
      return card;
    });
    setDeck(updatedDeck);
  };

  const toggleZone = (zone) => {
    setOpenZones((prevState) => ({
      ...prevState,
      [zone]: !prevState[zone],
    }));
  };

  const handleRowClick = async (card) => {
    setLoadingPrints(true);
    const artPrintings = await getCardPrints(card);
    setLoadingPrints(false);
    console.log(artPrintings);
    if (artPrintings && artPrintings.length > 0) {
      setSelectedCardImages(artPrintings);
      setSelectedCard(card);
      globalCarouselIndex = 0;
      setIsCarouselOpen(true);
    } else {
      alert("No art printings found for this card.");
    }
  };

  const closeCarousel = () => {
    setIsCarouselOpen(false);
  };

  const handleSelectCard = () => {
    if (selectedCard) {
      const cardIndex = deck.findIndex(
        (card) => card.oracleId === selectedCard.oracleId
      );
      if (cardIndex === -1) {
        console.log(`Card with ID ${cardId} not found in the deck.`);
        return;
      }
      console.log(globalCarouselIndex);
      const newCard = getPrintData(selectedCard.id, globalCarouselIndex);
      Object.assign(deck[cardIndex], newCard);
      localStorage.setItem("cachedDeck", JSON.stringify(deck));

      closeCarousel();
    }
  };

  const updateCarouselIndex = (index) => {
    globalCarouselIndex = index;
  };

  const getTotalMainZoneCards = () => {
    return deck
      .filter((card) => card.zone === "Main")
      .reduce((total, card) => total + card.quantity, 0);
  };

  if (loading) {
    return (
      <Flex
        direction="column"
        pt={{ base: "120px", md: "75px" }}
        align="center"
      >
        <Spinner size="xl" />
      </Flex>
    );
  }

  const zones = [
    "Main",
    "Sideboard",
    "Command Zone",
    "Planes/Schemes",
    "Maybeboard",
  ];
  const cardsByZone = zones.reduce((acc, zone) => {
    acc[zone] = deck.filter((card) => card.zone === zone);
    return acc;
  }, {});

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="12px 0px 28px 0px">
          <Flex direction="column">
            <Text fontSize="lg" color="#fff" fontWeight="bold" pb="8px">
              {deck.length > 0
                ? `Deck: ${location.state?.deck.name}`
                : "No deck loaded"}
            </Text>
            <Flex align="center">
              <Icon
                as={IoCheckmarkDoneCircleSharp}
                color="teal.300"
                w={4}
                h={4}
                pe="3px"
              />
              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                <Text fontWeight="bold" as="span">
                  {getTotalMainZoneCards()} cards
                </Text>{" "}
                in this deck.
              </Text>
            </Flex>
          </Flex>
        </CardHeader>
        {deck.length > 0 ? (
          <CardBody>
            <Table variant="simple" color="#fff">
              <Tbody>
                {zones.map((zone) => (
                  <React.Fragment key={zone}>
                    <Tr>
                      <Td
                        colSpan="11"
                        style={{ fontWeight: "bold", color: "#fff" }}
                      >
                        <Flex align="center" justify="space-between">
                          {zone}
                          <IconButton
                            size="sm"
                            icon={
                              openZones[zone] ? (
                                <ChevronUpIcon />
                              ) : (
                                <ChevronDownIcon />
                              )
                            }
                            onClick={() => toggleZone(zone)}
                            aria-label={`Toggle ${zone}`}
                            backgroundColor={"#2D3748"}
                            _hover={{ bg: "blue.800" }}
                            transition="background-color 0.2s ease-in-out"
                          />
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td colSpan="11" p={0}>
                        <Collapse in={openZones[zone]} animateOpacity>
                          <Table variant="simple" color="#fff" width="100%">
                            <Thead>
                              <Tr my=".8rem" ps="0px">
                                <Th
                                  ps="0px"
                                  color="gray.400"
                                  fontFamily="Plus Jakarta Display"
                                  borderBottomColor="#56577A"
                                >
                                  Card Name
                                </Th>
                                <Th
                                  color="gray.400"
                                  fontFamily="Plus Jakarta Display"
                                  borderBottomColor="#56577A"
                                >
                                  Quantity
                                </Th>
                                <Th
                                  color="gray.400"
                                  fontFamily="Plus Jakarta Display"
                                  borderBottomColor="#56577A"
                                >
                                  Set
                                </Th>
                                <Th
                                  color="gray.400"
                                  fontFamily="Plus Jakarta Display"
                                  borderBottomColor="#56577A"
                                >
                                  EDHREC rank
                                </Th>
                                <Th
                                  color="gray.400"
                                  fontFamily="Plus Jakarta Display"
                                  borderBottomColor="#56577A"
                                >
                                  CMC
                                </Th>
                                <Th
                                  color="gray.400"
                                  fontFamily="Plus Jakarta Display"
                                  borderBottomColor="#56577A"
                                >
                                  Colors
                                </Th>
                                <Th
                                  color="gray.400"
                                  fontFamily="Plus Jakarta Display"
                                  borderBottomColor="#56577A"
                                >
                                  Rarity
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {cardsByZone[zone].map((card, index) => (
                                <Tr
                                  key={index}
                                  _hover={{ bg: "gray.700", cursor: "pointer" }}
                                  onClick={() => handleRowClick(card)}
                                >
                                  <Td>{card.name}</Td>
                                  <Td>
                                    <Flex align="center">
                                      <IconButton
                                        icon={<FaMinus />}
                                        size="xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateQuantity(
                                            card.id,
                                            card.zone,
                                            -1
                                          );
                                        }}
                                        bg={bgButton}
                                        color="white"
                                        _hover={{ bg: "brand.500" }}
                                        transition="background-color 0.2s ease-in-out"
                                        aria-label="Decrease quantity"
                                      />
                                      <Text mx="2">{card.quantity}</Text>
                                      <IconButton
                                        icon={<FaPlus />}
                                        size="xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateQuantity(card.id, card.zone, 1);
                                        }}
                                        bg={bgButton}
                                        color="white"
                                        _hover={{ bg: "brand.500" }}
                                        transition="background-color 0.2s ease-in-out"
                                        aria-label="Increase quantity"
                                      />
                                    </Flex>
                                  </Td>
                                  <Td>{card.set}</Td>
                                  <Td>{card.edhrecRank}</Td>
                                  <Td>{card.cmc}</Td>
                                  <Td>
                                    {card.colorIdentity
                                      ? card.colorIdentity.join(", ")
                                      : ""}
                                  </Td>
                                  <Td>{card.rarity}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Collapse>
                      </Td>
                    </Tr>
                  </React.Fragment>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        ) : null}
      </Card>

      {loadingPrints && (
        <Flex
          justify="center"
          align="center"
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.5)"
          zIndex="9999"
        >
          <Spinner size="xl" color="teal.500" thickness="4px" speed="0.65s" />
        </Flex>
      )}

      {isCarouselOpen && (
        <Carousel
          selectedCardImages={selectedCardImages}
          handleSelectCard={handleSelectCard}
          closeCarousel={closeCarousel}
          globalCarouselIndex={globalCarouselIndex}
          updateCarouselIndex={updateCarouselIndex}
        />
      )}
    </Flex>
  );
}

export default Tables;
