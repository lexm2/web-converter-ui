import React, { useState, useEffect } from "react";
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
  Image,
  useToast,
  SimpleGrid,
  Box,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";

import GreenSvg from "assets/svg/Green.svg";
import RedSvg from "assets/svg/Red.svg";
import BlueSvg from "assets/svg/Blue.svg";
import BlackSvg from "assets/svg/Black.svg";
import WhiteSvg from "assets/svg/White.svg";
import ColorlessSvg from "assets/svg/Colorless.svg";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { useDeck } from "components/context/DeckContext";
import {
  getCardPrints,
  getPrintData,
  moveImageToFront,
} from "models/MTGTypes.js";
import Carousel from "./Carousel";

let globalCarouselIndex = 0;

function Tables() {
  const { deck, loading, updateQuantity, getTotalMainZoneCards, removeCard } = useDeck();
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
  const toast = useToast();

  const bgButton = useColorModeValue("brand.200", "brand.700");

  const getColorImage = (color) => {
    switch (color) {
      case "G":
        return GreenSvg;
      case "R":
        return RedSvg;
      case "U":
        return BlueSvg;
      case "B":
        return BlackSvg;
      case "W":
        return WhiteSvg;
      default:
        return ColorlessSvg;
    }
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
      const currentCardIndex = artPrintings.findIndex(
        (print) => print.id === card.id
      );

      setSelectedCardImages(artPrintings);
      setSelectedCard(card);
      globalCarouselIndex = 0;
      setIsCarouselOpen(true);
    } else {
      toast({
        title: "Error",
        description: "No art printings found for this card.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const closeCarousel = () => {
    setIsCarouselOpen(false);
  };

  const handleSelectCard = () => {
    if (selectedCard) {
      const cardIndex = deck.findIndex(
        (card) => card.oracle_id === selectedCard.oracle_id
      );
      if (cardIndex === -1) {
        console.log(`Card with ID ${card.oracle_id} not found in the deck.`);
        return;
      }
      console.log(globalCarouselIndex);
      const newCard = getPrintData(selectedCard.oracle_id, globalCarouselIndex);
      Object.assign(deck[cardIndex], newCard);
      localStorage.setItem("cachedDeck", JSON.stringify(deck));
      moveImageToFront(selectedCard.oracle_id, globalCarouselIndex);
      closeCarousel();
    }
  };

  const updateCarouselIndex = (index) => {
    globalCarouselIndex = index;
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
    <Flex direction="column" pt={{ base: "120px", md: "75px" }} width="100%">
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
            <Flex align="center" mt={2}>
              <Icon
                as={IoCheckmarkDoneCircleSharp}
                color="teal.300"
                w={4}
                h={4}
                pe="3px"
              />
              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                All cards legal in:{" "}
                {Object.entries(
                  deck.reduce((acc, card) => {
                    Object.entries(card.legalities).forEach(
                      ([format, legality]) => {
                        if (legality === "legal") {
                          acc[format] = (acc[format] || 0) + 1;
                        }
                      }
                    );
                    return acc;
                  }, {})
                )
                  .filter(([_, count]) => count === deck.length)
                  .map(([format]) => format)
                  .join(", ")}
              </Text>
            </Flex>
          </Flex>
        </CardHeader>
        {deck.length > 0 ? (
          <CardBody display="grid">
            <Flex direction="column">
              {zones.map((zone) => (
                <Box key={zone} mb={4} width="100%">
                  <Flex
                    align="center"
                    justify="space-between"
                    mb={2}
                    width="100%"
                  >
                    <Flex align="center">
                      <Text fontWeight="bold" color="#fff" mr={2}>
                        {zone}
                      </Text>
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
                  </Flex>
                  <Collapse in={openZones[zone]} animateOpacity>
                    <SimpleGrid
                      columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                      spacing={4}
                      templateColumns="repeat(auto-fill, minmax(480px, 1fr))"
                      justifyItems="center"
                    >
                      {cardsByZone[zone].map((card, index) => (
                        <Card
                          key={index}
                          onClick={() => handleRowClick(card)}
                          position="relative"
                          p={4}
                          width={{
                            base: "100%",
                            sm: "380px",
                            md: "420px",
                            lg: "460px",
                            xl: "500px",
                          }}
                          height={{ base: "60px", sm: "80px", md: "100px" }}
                          border="1px solid"
                          borderColor="blue.600"
                          cursor="pointer"
                          transition="all 0.3s"
                          bgGradient="linear(to-r, brand.800, brand.1000)"
                          _hover={{
                            transform: "translateY(-5px)",
                            boxShadow: "xl",
                            bgGradient: "linear(to-r, brand.300, brand.500)",
                          }}
                          mt={2}
                          mb={0}
                        >
                          <Text fontWeight="bold" color="white" mb={2}>
                            {card.name}
                          </Text>
                          <HStack
                            spacing={2}
                            position="absolute"
                            bottom={2}
                            right={2}
                          >
                            <Button
                              size="sm"
                              colorScheme="blackAlpha"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="purple"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCard(card.oracle_id);
                              }}
                            >
                              Delete
                            </Button>
                          </HStack>
                          <Flex
                            position="absolute"
                            top={4}
                            right={4}
                            align="center"
                          >
                            <IconButton
                              icon={<FaMinus />}
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(card.id, card.zone, -1);
                              }}
                              bg={bgButton}
                              color="white"
                              _hover={{ bg: "brand.500" }}
                              transition="background-color 0.2s ease-in-out"
                              aria-label="Decrease quantity"
                            />
                            <Text mx="2" color="white">
                              {card.quantity}
                            </Text>
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
                        </Card>
                      ))}
                    </SimpleGrid>
                  </Collapse>
                </Box>
              ))}
            </Flex>
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
