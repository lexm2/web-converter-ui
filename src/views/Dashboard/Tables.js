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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { MTGDeck, MTGCard, importDeckList, writeXML } from "models/MTGTypes.js"; // Import MTGDeck, MTGCard, importDeckList, and writeXML

function Tables() {
  const [deck, setDeck] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [openZones, setOpenZones] = useState({
    Main: true,
    Sideboard: true,
    "Command Zone": true,
    "Planes/Schemes": true,
    Maybeboard: true,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCardImages, setSelectedCardImages] = useState([]);

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

  const updateQuantity = (cardId, zone, delta) => {
    const updatedDeck = deck.map((card) => {
      if (card.id === cardId && card.zone === zone) {
        return { ...card, quantity: Math.max(1, card.quantity + delta) };
      }
      return card;
    });
    setDeck(updatedDeck);
    localStorage.setItem(
      "cachedDeck",
      JSON.stringify({ ...location.state.deck, cards: updatedDeck })
    );
  };

  const toggleZone = (zone) => {
    setOpenZones((prevState) => ({
      ...prevState,
      [zone]: !prevState[zone],
    }));
  };

  const handleRowClick = (card) => {
    setSelectedCardImages(card.cardFaces.map(face => face.image_uris.large));
    onOpen();
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
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="lg" color="#fff" fontWeight="bold">
            {deck.length > 0
              ? `Deck: ${location.state?.deck.name}`
              : "No deck loaded"}
          </Text>
        </CardHeader>
        {deck.length > 0 ? (
          <CardBody>
            <Table variant="simple" color="#fff">
              <Thead>
                <Tr my=".8rem" ps="0px" color="gray.400">
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Card Name
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Quantity
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Set
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    EDHREC rank
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    CMC
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Colors
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Rarity
                  </Th>
                </Tr>
              </Thead>
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
                                      <Button
                                        size="xs"
                                        onClick={() =>
                                          updateQuantity(card.id, card.zone, -1)
                                        }
                                        bg="teal.500"
                                        color="white"
                                        _hover={{ bg: "teal.600" }}
                                        transition="background-color 0.2s ease-in-out"
                                      >
                                        -
                                      </Button>
                                      <Text mx="2">{card.quantity}</Text>
                                      <Button
                                        size="xs"
                                        onClick={() =>
                                          updateQuantity(card.id, card.zone, 1)
                                        }
                                        bg="teal.500"
                                        color="white"
                                        _hover={{ bg: "teal.600" }}
                                        transition="background-color 0.2s ease-in-out"
                                      >
                                        +
                                      </Button>
                                    </Flex>
                                  </Td>
                                  <Td>{card.set}</Td>
                                  <Td>{card.edhrecRank}</Td>
                                  <Td>{card.cmc}</Td>
                                  <Td>
                                    {card.colorIdentity ? card.colorIdentity.join(", ") : ""}
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Card Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Carousel>
              {selectedCardImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Card face ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Tables;
