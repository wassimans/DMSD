import { useState } from "react";
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import Home from "../Components/home";
import Subscription from "../Components/subscription";
import Vault from "../Components/vault";
import MobileNav from "../Components/UI/MobileNave";
import SidebarContent from "../Components/UI/SideBarContent";
import { useDmsdIsWAlletToProtect } from "@/generated";
import { useDmsdApp } from "@/contexts/DmsdContext";
import Approve from "./approve";
import { useAccount } from "wagmi";

export default function DMSD() {
  const {
    state: { contractAddress },
    dispatch,
  } = useDmsdApp();

  const { address } = useAccount();

  const { data: isWalletToProtect } = useDmsdIsWAlletToProtect({
    address: contractAddress,
    args: [address!],
  });
  console.log("isWalletToProtect", isWalletToProtect);
  const [activePage, setActivePage] = useState({
    approve: isWalletToProtect ? true : false,
    home: isWalletToProtect ? false : true,
    subscription: false,
    vault: false,
    logout: false,
  });

  const handleActivePage = (name: string) => {
    switch (name) {
      case "Accueil":
        setActivePage({
          home: true,
          subscription: false,
          vault: false,
          approve: false,
          logout: false,
        });
        break;
      case "Souscriptions":
        setActivePage({
          home: false,
          subscription: true,
          vault: false,
          approve: false,
          logout: false,
        });
        break;
      case "Vault MultiSig":
        setActivePage({
          home: false,
          subscription: false,
          vault: true,
          approve: false,
          logout: false,
        });
        break;
      case "Approve":
        setActivePage({
          home: false,
          subscription: false,
          vault: false,
          approve: true,
          logout: false,
        });
        break;
      default:
        break;
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        change={(param) => handleActivePage(param)}
        display={{ base: "none", md: "block" }}
        isWalletToProtect={!isWalletToProtect}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            change={(param) => handleActivePage(param)}
            isWalletToProtect={!isWalletToProtect}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {activePage.home && !isWalletToProtect && <Home />}
        {activePage.subscription && !isWalletToProtect && <Subscription />}
        {activePage.vault && !isWalletToProtect && <Vault />}
        {activePage.approve && isWalletToProtect && <Approve />}
      </Box>
    </Box>
  );
}
