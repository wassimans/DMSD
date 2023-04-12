import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
} from "@chakra-ui/react";
import { SiVault } from "react-icons/si";
import { FaCheckDouble } from "react-icons/fa";
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
  isWalletToProtect: boolean;
}

export default function SideBarContent({
  onClose,
  change,
  isWalletToProtect,
  ...rest
}: SidebarProps) {
  const [focusHome, setFocusHome] = useState(false);
  const [focusSubscription, setFocusSubscription] = useState(false);
  const [focusVault, setFocusVault] = useState(false);
  const [focusApprove, setFocusApprove] = useState(false);

  const handleActivePage = (name: string) => {
    change(name);
    switch (name) {
      case "Accueil":
        setFocusHome(true);
        setFocusSubscription(false);
        setFocusVault(false);
        setFocusApprove(false);
        break;
      case "Souscriptions":
        setFocusHome(false);
        setFocusSubscription(true);
        setFocusVault(false);
        setFocusApprove(false);
        break;
      case "Vault MultiSig":
        setFocusHome(false);
        setFocusSubscription(false);
        setFocusVault(true);
        setFocusApprove(false);
        break;
      case "Approve":
        setFocusHome(false);
        setFocusSubscription(false);
        setFocusVault(false);
        setFocusApprove(true);
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
      case "Approve":
        return focusApprove;
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
      {isWalletToProtect && (
        <>
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
        </>
      )}
      {!isWalletToProtect && (
        <NavItem
          key="Approve"
          icon={FaCheckDouble}
          focusItem={resolveFocus("Approve")}
          onClick={() => handleActivePage("Approve")}
        >
          Approve
        </NavItem>
      )}
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
