import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
  } from "@chakra-ui/react";

  import {
    IoCheckmarkDoneCircleSharp,
    IoEllipsisHorizontal,
  } from "react-icons/io5";

const StatMenu = ({setSelectedStat}) => (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<IoEllipsisHorizontal />}
        variant='outline'
        bg="#22234B"
        _hover="none"
        _active="none"
        color="#7551FF"
      />
      <MenuList bg="linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)">
        <MenuItem onClick={() => setSelectedStat('creatures')} color="#fff">Creatures</MenuItem>
        <MenuItem onClick={() => setSelectedStat('instants')} color="#fff">Instants</MenuItem>
        <MenuItem onClick={() => setSelectedStat('sorceries')} color="#fff">Sorceries</MenuItem>
        <MenuItem onClick={() => setSelectedStat('artifacts')} color="#fff">Artifacts</MenuItem>
        <MenuItem onClick={() => setSelectedStat('enchantments')} color="#fff">Enchantments</MenuItem>
        <MenuItem onClick={() => setSelectedStat('lands')} color="#fff">Lands</MenuItem>
      </MenuList>
    </Menu>
  );

  export default StatMenu;