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
  Image,
  Text,
} from "@chakra-ui/react";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

function Tables() {
  const [deck, setDeck] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadedDeck = location.state?.deck;
    if (loadedDeck) {
      setDeck(loadedDeck);
      localStorage.setItem("cachedDeck", JSON.stringify(loadedDeck));
    } else {
      const cachedDeck = localStorage.getItem("cachedDeck");
      if (cachedDeck) {
        setDeck(JSON.parse(cachedDeck));
      } else {
        alert("No deck found. Please load a deck first.");
      }
    }
  }, [location]);

  if (!deck) {
    alert("No deck found. Please load a deck first.");
  }

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="lg" color="#fff" fontWeight="bold">
            Deck: {deck.name}
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color="#fff">
            <Thead>
              <Tr my=".8rem" ps="0px" color="gray.400">
                <Th color="gray.400" borderBottomColor="#56577A">
                  Card Image
                </Th>
                <Th color="gray.400" borderBottomColor="#56577A">
                  Card Name
                </Th>
                <Th color="gray.400" borderBottomColor="#56577A">
                  Quantity
                </Th>
                <Th color="gray.400" borderBottomColor="#56577A">
                  Type
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {deck.cards.map((card, index) => (
                <Tr key={index}>
                  <Td>
                    <Image
                      src={
                        card.imageUris?.normal ||
                        "path/to/placeholder-image.jpg"
                      }
                      alt={card.name}
                      boxSize="100px"
                      objectFit="contain"
                    />
                  </Td>
                  <Td>{card.name}</Td>
                  <Td>{card.quantity}</Td>
                  <Td>{card.typeLine}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Tables;
