import React from 'react';
import { Box, Text, List, ListItem } from "@chakra-ui/react";

const LegalFormats = ({ fullyLegalFormats }) => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" color="#fff" mb={2}>Legal Formats</Text>
      <List spacing={2}>
        {fullyLegalFormats.map((format) => (
          <ListItem key={format} px={4} fontSize="md" fontWeight="medium" color="gray.400">
            {format.charAt(0).toUpperCase() + format.slice(1)}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LegalFormats;