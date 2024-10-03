import React, { useEffect, useRef, useState } from "react";
import { SearchIcon, BellIcon } from "@chakra-ui/icons";
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
import { ItemContent } from "components/Menu/ItemContent";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import routes from "routes.js";

export default function HeaderLinks(props) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;
  const { isOpen, onOpen: onSearchOpen, onClose } = useDisclosure();
  const searchInputRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);

  let inputBg = "#0F1535";
  let mainText = "gray.400";
  let navbarIcon = "white";
  let searchIcon = "white";

  if (secondary) {
    navbarIcon = "white";
    mainText = "white";
  }
  const settingsRef = React.useRef();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
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

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    // Simulated search results
    const results = [
      { id: 1, name: "Dashboard", type: "Page" },
      { id: 2, name: "Profile", type: "Page" },
      { id: 3, name: "Settings", type: "Feature" },
      { id: 4, name: "Analytics", type: "Feature" },
      { id: 5, name: "Users", type: "Data" },
    ].filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

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
            ref={searchInputRef}
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
              fontSize="xs"
              py="11px"
              color={mainText}
              placeholder="Type here..."
              borderRadius="inherit"
              onChange={handleSearch}
              autoFocus
            />
          </InputGroup>
          {searchResults.length > 0 && (
            <Box
              bg={inputBg}
              borderRadius="15px"
              mt={2}
              p={4}
              className="search-results-table"
              borderColor="gray.600"
              borderWidth={"1px"}
            >
              <Table
                colorScheme="whiteAlpha"
                color={mainText}
              >
                <Thead>
                  <Tr>
                    <Th color={mainText} borderBottom="none">
                      Name
                    </Th>
                    <Th color={mainText} borderBottom="none">
                      Type
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {searchResults.map((result) => (
                    <Tr key={result.id}>
                      <Td borderBottom="none">{result.name}</Td>
                      <Td borderBottom="none">{result.type}</Td>
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
