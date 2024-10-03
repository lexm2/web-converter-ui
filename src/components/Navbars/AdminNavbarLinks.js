import React, { useEffect, useRef, useState } from "react";
import { useDeck } from "components/context/DeckContext";
import { SearchIcon, BellIcon, AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Box,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { ProfileIcon, SettingsIcon } from "components/Icons/Icons";
import API from "models/API.js";
import { ItemContent } from "components/Menu/ItemContent";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import routes from "routes.js";

export default function HeaderLinks(props) {
  const { deck, addCard } = useDeck();
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;
  const { isOpen, onOpen: onSearchOpen, onClose } = useDisclosure();
  const searchObject = useRef(null);
  const searchInputRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);

  const [hasTyped, setHasTyped] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  let inputBg = "#0F1535";
  let mainText = "gray.400";
  let navbarIcon = "white";
  let searchIcon = "white";

  if (secondary) {
    navbarIcon = "white";
    mainText = "white";
  }
  const settingsRef = React.useRef();

  const debouncedSearch = useRef(
    debounce(async (term) => {
      if (term.length > 0) {
        const results = await API.autocompleteCardSearch(term);
        setSearchResults(results.map((name, index) => ({ id: index, name })));
      }
    }, 1000)
  ).current;

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setHasTyped(true);
    debouncedSearch(term);
  };

  const handleAddCard = async (cardName) => {
    console.log("Adding card:", cardName);
    addCard(cardName);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (
        searchObject.current &&
        !searchObject.current.contains(event.target) &&
        !event.target.closest(".search-results-table")
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
    >
      <IconButton
        aria-label="Search"
        icon={<SearchIcon color={searchIcon} w="18px" h="18px" />}
        bg="inherit"
        borderRadius="30%"
        _hover={{ bg: "whiteAlpha.200" }}
        onClick={onSearchOpen}
      />
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.7)"
        backdropFilter={isOpen ? "blur(10px)" : "blur(0px)"}
        zIndex="9999"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        pt="100px"
        opacity={isOpen ? 1 : 0}
        pointerEvents={isOpen ? "auto" : "none"}
        transition="all 0.3s ease-in-out"
      >
        <Flex direction="column" w="50%">
          <InputGroup
            ref={searchObject}
            bg={inputBg}
            borderRadius="10px"
            mb={2}
          >
            <InputLeftElement
              children={
                <IconButton
                  bg="inherit"
                  borderRadius="inherit"
                  _hover="none"
                  _active={{
                    bg: "inherit",
                    transform: "none",
                    borderColor: "transparent",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                  icon={<SearchIcon color={searchIcon} w="15px" h="15px" />}
                ></IconButton>
              }
            />
            <Input
              ref={searchInputRef}
              fontSize="xs"
              py="11px"
              color={mainText}
              placeholder="Type here..."
              borderRadius="inherit"
              onChange={handleSearch}
              value={searchTerm}
            />
          </InputGroup>
          {hasTyped && searchResults.length > 0 && (
            <Box
              bg={inputBg}
              borderRadius="15px"
              mt={2}
              p={4}
              className="search-results-table"
              borderColor="gray.600"
              borderWidth={"1px"}
              maxHeight="70vh"
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "gray.500",
                  borderRadius: "24px",
                },
              }}
            >
              <Table
                variant="striped"
                colorScheme="whiteAlpha"
                color={mainText}
                fontSize="xs"
              >
                <Thead>
                  <Tr>
                    <Th color={mainText} borderBottom="none" fontSize="xs">
                      Name
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {searchResults.map((result) => (
                    <Tr key={result.id}>
                      <Td borderBottom="none" fontSize="xs">
                        {result.name}
                      </Td>
                      <Td borderBottom="none" fontSize="xs">
                        {result.type}
                      </Td>
                      <Td borderBottom="none" fontSize="xs" textAlign="right">
                        <IconButton
                          aria-label="Add card"
                          icon={<AddIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="whiteAlpha"
                          onClick={() => {
                            handleAddCard(result.name);
                            onClose();
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Flex>
      </Box>
      <SidebarResponsive
        iconColor="gray.500"
        logoText={props.logoText}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />
      <IconButton
        aria-label="Settings"
        icon={<SettingsIcon color={navbarIcon} w="18px" h="18px" />}
        bg="inherit"
        borderRadius="50%"
        _hover={{ bg: "whiteAlpha.200" }}
        onClick={props.onOpen}
      />
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Notifications"
          icon={<BellIcon color={navbarIcon} w="18px" h="18px" />}
          bg="inherit"
          borderRadius="50%"
          _hover={{ bg: "whiteAlpha.200" }}
        />
        <MenuList
          border="transparent"
          backdropFilter="blur(63px)"
          bg="linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.69) 76.65%)"
          borderRadius="20px"
        >
          <Flex flexDirection="column">
            {/* Menu items can be added here */}
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
