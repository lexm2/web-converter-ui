import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { MTGDeck, importDeckList, writeXML } from "models/MTGTypes";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import signInImage from "assets/img/signInImage.png";
import AuthFooter from "components/Footer/AuthFooter";
import GradientBorder from "components/GradientBorder/GradientBorder";

function LoadDeck() {
  const titleColor = "white";
  const textColor = "gray.400";

  const [cachedDeck, setCachedDeck] = useState(null);
  const decklistInputRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const savedDeck = localStorage.getItem("cachedDeck");
    if (savedDeck) {
      setCachedDeck(JSON.parse(savedDeck));
    }
  }, []);

  const handleLoadFromText = async () => {
    const decklistText = decklistInputRef.current.value;

    if (decklistText) {
      const newDeck = new MTGDeck("Imported Deck");
      const cards = await importDeckList(decklistText);

      newDeck.cards = cards;
      setCachedDeck(newDeck);

      console.log("Deck loaded and cached successfully!");

      // Redirect to /tables route with the cached deck
      history.push("/admin/tables", { deck: newDeck });
    } else {
      console.log("Please enter a decklist.");
    }
  };

  const handleQuickLoadFromText = async () => {
    const decklistText = decklistInputRef.current.value;
    const newDeck = new MTGDeck("Imported Deck");
    const cards = await importDeckList(decklistText);

    newDeck.cards = cards;
    writeXML(newDeck);
  };

  const handleLoadFromFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        const deckListString = event.target.result;
        const newDeck = new MTGDeck("Imported Deck");
        const cards = await importDeckList(deckListString);

        newDeck.cards = cards;
        setCachedDeck(newDeck);

        history.push("/admin/tables", { deck: newDeck });
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  return (
    <Flex position="relative">
      <Flex
        minH="100vh"
        h={{ base: "120vh", lg: "fit-content" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        pt={{ sm: "100px", md: "0px" }}
        flexDirection="column"
        me={{ base: "auto", lg: "50px", xl: "auto" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          mx={{ base: "auto", lg: "unset" }}
          ms={{ base: "auto", lg: "auto" }}
          w={{ base: "100%", md: "50%", lg: "450px" }}
          px="50px"
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            mt={{ base: "50px", md: "150px", lg: "160px", xl: "245px" }}
            mb={{ base: "60px", lg: "95px" }}
          >
            <Heading color={titleColor} fontSize="32px" mb="10px">
              Paste Deck
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColor}
              fontWeight="bold"
              fontSize="14px"
            >
              Paste a deck below or load from a file
            </Text>
            <FormControl>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="normal"
                color="white"
              >
                Decklist
              </FormLabel>
              <GradientBorder
                mb="24px"
                w={{ base: "100%", lg: "fit-content" }}
                borderRadius="20px"
              >
                <Input
                  ref={decklistInputRef}
                  color="white"
                  bg="rgb(19,21,54)"
                  border="transparent"
                  borderRadius="20px"
                  fontSize="sm"
                  size="lg"
                  w={{ base: "100%", md: "346px" }}
                  maxW="100%"
                  h="20rem"
                  placeholder="Paste decklist here"
                />
              </GradientBorder>
            </FormControl>
            <Button
              variant="brand"
              fontSize="10px"
              type="submit"
              w="100%"
              maxW="350px"
              h="45"
              mb="20px"
              mt="20px"
              onClick={handleLoadFromText}
            >
              LOAD FROM TEXT
            </Button>
            <Button
              variant="outline"
              fontSize="10px"
              type="button"
              textColor="#582CFF"
              w="100%"
              maxW="350px"
              h="45"
              mb="20px"
              onClick={handleLoadFromFile}
            >
              LOAD FROM FILE
            </Button>
            <Button
              variant="solid"
              fontSize="10px"
              type="button"
              w="100%"
              maxW="350px"
              h="45"
              mb="20px"
              onClick={handleQuickLoadFromText}
            >
              QUICK CONVERT FROM TEXT
            </Button>
          </Flex>
        </Flex>
        <Box
          w={{ base: "335px", md: "450px" }}
          mx={{ base: "auto", lg: "unset" }}
          ms={{ base: "auto", lg: "auto" }}
          mb="80px"
        >
          <AuthFooter />
        </Box>
        <Box
          display={{ base: "none", lg: "block" }}
          overflowX="hidden"
          h="100%"
          maxW={{ md: "50vw", lg: "50vw" }}
          minH="100vh"
          w="960px"
          position="absolute"
          left="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Text
              textAlign="center"
              color="white"
              letterSpacing="8px"
              fontSize="20px"
              fontWeight="500"
            >
              INSPIRED BY THE FUTURE:
            </Text>
            <Text
              textAlign="center"
              color="transparent"
              letterSpacing="8px"
              fontSize="36px"
              fontWeight="bold"
              bgClip="text !important"
              bg="linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)"
            >
              THE VISION UI DASHBOARD
            </Text>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default LoadDeck;
