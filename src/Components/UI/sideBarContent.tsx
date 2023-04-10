import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
} from "@chakra-ui/react";
import { SiVault } from "react-icons/si";
import { SlLogout } from "react-icons/sl";
import { AiFillHome } from "react-icons/ai";
import { RiServiceFill, RiLogoutBoxFill } from "react-icons/ri";
import { IconType } from "react-icons";
import { useState } from "react";
import { signOut } from "next-auth/react";
import NavItem from "./NavItem";

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Accueil", icon: AiFillHome },
  { name: "Souscriptions", icon: RiServiceFill },
  { name: "Vault MultiSig", icon: SiVault },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
  change: (name: string) => void;
}

export default function SideBarContent({
  onClose,
  change,
  ...rest
}: SidebarProps) {
  const [focusHome, setFocusHome] = useState(false);
  const [focusSubscription, setFocusSubscription] = useState(false);
  const [focusVault, setFocusVault] = useState(false);

  const handleActivePage = (name: string) => {
    change(name);
    switch (name) {
      case "Accueil":
        setFocusHome(true);
        setFocusSubscription(false);
        setFocusVault(false);
        break;
      case "Souscriptions":
        setFocusHome(false);
        setFocusSubscription(true);
        setFocusVault(false);
        break;
      case "Vault MultiSig":
        setFocusHome(false);
        setFocusSubscription(false);
        setFocusVault(true);
        break;
      case "Déconnexion":
        signOut({ redirect: true });
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
      case "Vault MultiSig":
        return focusVault;
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
      <NavItem
        key="Déconnexion"
        icon={RiLogoutBoxFill}
        focusItem={resolveFocus("Déconnexion")}
        onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
      >
        Déconnexion
      </NavItem>
    </Box>
  );
}