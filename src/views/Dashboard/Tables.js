import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Flex, Table, Tbody, Th, Thead, Tr, Td, Text, Spinner, Button, Collapse, IconButton } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { MTGDeck, MTGCard } from "models/MTGTypes.js"; // Import MTGDeck and MTGCard

function Tables() {
  const [deck, setDeck] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [openZones, setOpenZones] = useState({
    Main: true,
    Sideboard: true,
    "Command Zone": true,
    "Planes/Schemes": true,
    Maybeboard: true,
  });

  useEffect(() => {
    const loadDeck = async () => {
      const loadedDeck = location.state?.deck;
      if (loadedDeck) {
        await loadedDeck.loadCardDetails();
        setDeck(loadedDeck);
        localStorage.setItem("cachedDeck", JSON.stringify(loadedDeck));
      } else {
        const cachedDeck = localStorage.getItem("cachedDeck");
        if (cachedDeck) {
          const parsedDeck = JSON.parse(cachedDeck);
          const deckInstance = new MTGDeck(parsedDeck.name);
          deckInstance.cards = parsedDeck.cards.map(card => new MTGCard(card, card.zone));
          deckInstance.cardCount = parsedDeck.cardCount;
          await deckInstance.loadCardDetails();
          setDeck(deckInstance);
        } else {
          alert("No deck found. Please load a deck first.");
        }
      }
      setLoading(false);
    };

    loadDeck();
  }, [location]);

  const updateQuantity = (cardId, zone, delta) => {
    const updatedDeck = { ...deck };
    const card = updatedDeck.cards.find(c => c.id === cardId && c.zone === zone);
    if (card) {
      card.quantity += delta;
      if (card.quantity < 1) {
        card.quantity = 1;
      }
      setDeck(updatedDeck);
      localStorage.setItem("cachedDeck", JSON.stringify(updatedDeck));
    }
  };

  const toggleZone = (zone) => {
    setOpenZones(prevState => ({
      ...prevState,
      [zone]: !prevState[zone],
    }));
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

  const zones = ["Main", "Sideboard", "Command Zone", "Planes/Schemes", "Maybeboard"];
  const cardsByZone = zones.reduce((acc, zone) => {
    acc[zone] = deck.cards.filter(card => card.zone === zone);
    return acc;
  }, {});

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="lg" color="#fff" fontWeight="bold">
            {deck ? `Deck: ${deck.name}` : "No deck loaded"}
          </Text>
        </CardHeader>
        {deck ? (
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
                    Type
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Mana Cost
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    CMC
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Oracle Text
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Power
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Toughness
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Colors
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Set Name
                  </Th>
                  <Th color="gray.400" borderBottomColor="#56577A">
                    Rarity
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {zones.map(zone => (
                  <React.Fragment key={zone}>
                    <Tr>
                      <Td colSpan="11" style={{ fontWeight: 'bold', color: '#fff' }}>
                        <Flex align="center" justify="space-between">
                          {zone}
                          <IconButton
                            size="sm"
                            icon={openZones[zone] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            onClick={() => toggleZone(zone)}
                            aria-label={`Toggle ${zone}`}
                            backgroundColor={'#2D3748'}
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
                                <Tr key={index}>
                                  <Td>{card.name}</Td>
                                  <Td>
                                    <Flex align="center">
                                      <Button
                                        size="xs"
                                        onClick={() => updateQuantity(card.id, card.zone, -1)}
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
                                        onClick={() => updateQuantity(card.id, card.zone, 1)}
                                        bg="teal.500"
                                        color="white"
                                        _hover={{ bg: "teal.600" }}
                                        transition="background-color 0.2s ease-in-out"
                                      >
                                        +
                                      </Button>
                                    </Flex>
                                  </Td>
                                  <Td>{card.typeLine}</Td>
                                  <Td>{card.manaCost}</Td>
                                  <Td>{card.cmc}</Td>
                                  <Td>{card.oracleText}</Td>
                                  <Td>{card.power}</Td>
                                  <Td>{card.toughness}</Td>
                                  <Td>{card.colors ? card.colors.join(", ") : ""}</Td>
                                  <Td>{card.setName}</Td>
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
    </Flex>
  );
}

export default Tables;