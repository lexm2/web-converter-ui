import React from "react";
import { Box, Text, SimpleGrid, Flex, Badge, Tooltip } from "@chakra-ui/react";

const LegalFormats = ({ deckLegality }) => {
  console.log("deckLegality:", deckLegality);
  if (!deckLegality) return null;

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" color="#fff" mb={4}>
        Format Legality
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {Object.entries(deckLegality).map(([format, details]) => (
          <Box key={format} p={4} bg="whiteAlpha.100" borderRadius="md">
            <Flex justify="space-between" align="center">
              <Text
                fontSize="md"
                fontWeight="medium"
                color="gray.400"
                textTransform="capitalize"
                maxW="60%"
                isTruncated
              >
                {format}
              </Text>
              <Tooltip
                label={`${details.currentDeckSize}/${details.minDeckSize}${
                  details.maxDeckSize !== "unlimited"
                    ? `-${details.maxDeckSize}`
                    : "+"
                } cards`}
              >
                <Badge
                  colorScheme={details.isLegal ? "green" : "red"}
                  variant="subtle"
                  minW="60px"
                  textAlign="center"
                >
                  {details.isLegal ? "Legal" : "Not Legal"}
                </Badge>
              </Tooltip>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default LegalFormats;
