import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { DocumentIcon, HomeIcon, StatsIcon } from "components/Icons/Icons";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import PropTypes from "prop-types";
import React from "react";
import { NavLink } from "react-router-dom";
import routes from "routes.js";
import { MTGDeck, importDeckList, writeXML } from "models/MTGTypes";

export default function AuthNavbar(props) {
  const [open, setOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const { logo, logoText, secondary, ...rest } = props;
  const navbarIcon = "white";
  const mainText = "white";
  const navbarBg =
    "linear-gradient(123.64deg, rgba(255, 255, 255, 0) -22.38%, rgba(255, 255, 255, 0.039) 70.38%)";
  const navbarBorder = "rgba(226, 232, 240, 0.3)";
  const navbarShadow = useColorModeValue(
    "0px 7px 23px rgba(0, 0, 0, 0.05)",
    "none"
  );
  const navbarFilter = useColorModeValue(
    "none",
    "drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))"
  );
  const navbarBackdrop = "blur(42px)";
  const navbarPosition = "fixed";

  const handleQuickConvert = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        const deckListString = event.target.result;
        const deck = new MTGDeck("Imported Deck");
        const cards = await importDeckList(deckListString);
        deck.cards = cards;
        writeXML(deck);
      };      reader.readAsText(file);
    };
    fileInput.click();
  };

  var brand = (
    <Link
      href={`${process.env.PUBLIC_URL}/#/`}
      target="_blank"
      display="flex"
      lineHeight="100%"
      fontWeight="bold"
      justifyContent="center"
      alignItems="center"
      color={mainText}
    >
      <Box
        bg="white"
        bgClip="text"
      >
        <Text fontSize="sm" letterSpacing="3px" mt="3px" color="transparent">
          {logoText}
        </Text>
      </Box>
    </Link>
  );

  var linksAuth = (
    <HStack display={{ sm: "none", lg: "flex" }}>
      <NavLink to="/admin/tables">
        <Button
          fontSize="sm"
          ms="0px"
          px="0px"
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant="transparent-with-icon"
          leftIcon={<StatsIcon color={navbarIcon} w="12px" h="12px" me="0px" />}
        >
          <Text>Tables</Text>
        </Button>
      </NavLink>
      <NavLink to="/auth/loaddata">
        <Button
          fontSize="sm"
          ms="0px"
          px="0px"
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant="transparent-with-icon"
          leftIcon={
            <DocumentIcon color={navbarIcon} w="12px" h="12px" me="0px" />
          }
        >
          <Text>Deck Loader</Text>
        </Button>
      </NavLink>
    </HStack>
  );

  return (
    <Flex
      position={navbarPosition}
      top="16px"
      left="50%"
      transform="translate(-50%, 0px)"
      background={navbarBg}
      border="2px solid"
      borderColor={navbarBorder}
      boxShadow={navbarShadow}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderRadius="20px"
      px="16px"
      py="22px"
      mx="auto"
      width="1044px"
      maxW="90%"
      alignItems="center"
    >
      <Flex w="100%" justifyContent={{ sm: "start", lg: "space-between" }}>
        {brand}
        <Box
          ms={{ base: "auto", lg: "0px" }}
          display={{ base: "flex", lg: "none" }}
        >
          <SidebarResponsive
            iconColor="white"
            logoText={props.logoText}
            secondary={props.secondary}
            routes={routes}
            {...rest}
          />
        </Box>
        {linksAuth}
        <Link href="#/auth/loaddata">
          <Button
            fontSize="xs"
            variant="brand"
            borderRadius="12px"
            px="30px"
            display={{
              sm: "none",
              lg: "flex",
            }}
            onClick={handleQuickConvert}
          >
            Quick Convert
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}

AuthNavbar.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  brandText: PropTypes.string,
};
