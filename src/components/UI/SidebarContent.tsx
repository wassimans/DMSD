import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";
import { SlWallet } from "react-icons/sl";
import { MdAccountBalance } from "react-icons/md";
import { IconType } from "react-icons";
import NavItem from "./NavItem";
import { useState } from "react";

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Accueil", icon: FiHome },
  { name: "Souscriptions", icon: MdAccountBalance },
  { name: "Wallets", icon: SlWallet },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
  change: (name: string) => void;
}

const SidebarContent = ({ onClose, change, ...rest }: SidebarProps) => {
  const [focusHome, setFocusHome] = useState(false);
  const [focusSubscription, setFocusSubscription] = useState(false);
  const [focusWallets, setFocusWallets] = useState(false);

  const handleActivePage = (name: string) => {
    change(name);
    switch (name) {
      case "Accueil":
        setFocusHome(true);
        setFocusSubscription(false);
        setFocusWallets(false);
        break;
      case "Souscriptions":
        setFocusHome(false);
        setFocusSubscription(true);
        setFocusWallets(false);
        break;
      case "Wallets":
        setFocusHome(false);
        setFocusSubscription(false);
        setFocusWallets(true);
        break;
      default:
        break;
    }
  };
  const resolveFocus = (name: string) => {
    switch (name) {
      case "Accueil":
        return focusHome;
      case "Souscriptions":
        return focusSubscription;
      case "Wallets":
        return focusWallets;
      default:
        return false;
    }
  };
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          DMSD
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          focusItem={resolveFocus(link.name)}
          onClick={() => handleActivePage(link.name)}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

export default SidebarContent;
