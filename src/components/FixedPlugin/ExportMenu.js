import { Button, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";
import { FiDownload } from "react-icons/fi"; // Import the download icon
import { MTGDeck, MTGCard, writeXML } from "models/MTGTypes.js"; // Import MTGDeck and writeXML

export default function ExportMenu(props) {
  const { secondary, onChange, onSwitch, fixed, ...rest } = props;
  const navbarIcon = useColorModeValue("white", "gray.800");
  const bgButton = useColorModeValue("brand.200", "brand.700");

  const exportDeck = async () => {
    const cachedDeck = localStorage.getItem("cachedDeck");
    if (cachedDeck) {
      const deckData = JSON.parse(cachedDeck);
      const deckInstance = new MTGDeck(deckData.name);
      deckData.cards.forEach(cardData => {
        const card = new MTGCard(cardData, cardData.zone, cardData.quantity);
        deckInstance.addCard(card, cardData.quantity);
      });
      console.log("exporting deck:", deckInstance);
      await writeXML(deckInstance);
    } else {
      alert("No deck found to export.");
    }
  };

  return (
    <Button
      h="52px"
      w="52px"
      onClick={exportDeck}
      bg={bgButton}
      position="fixed"
      variant="no-hover"
      left={document.documentElement.dir === "rtl" ? "35px" : ""}
      right={document.documentElement.dir === "rtl" ? "" : "35px"}
      bottom="30px"
      borderRadius="50px"
      boxShadow="0 2px 12px 0 rgb(0 0 0 / 16%)"
    >
      <FiDownload size="24px" color={navbarIcon} /> {/* Use the icon here */}
    </Button>
  );
}

ExportMenu.propTypes = {
  fixed: PropTypes.bool,
  onChange: PropTypes.func,
  onSwitch: PropTypes.func,
};
