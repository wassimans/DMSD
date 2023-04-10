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
import Vault from "../Components/subscription";
import MobileNav from "../Components/UI/MobileNave";
import SidebarContent from "../Components/UI/SideBarContent";

export default function DMSD() {
  const [activePage, setActivePage] = useState({
    home: true,
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
          logout: false,
        });
        break;
      case "Souscriptions":
        setActivePage({
          home: false,
          subscription: true,
          vault: false,
          logout: false,
        });
        break;
      case "Vault":
        setActivePage({
          home: false,
          subscription: false,
          vault: true,
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
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {activePage.home && <Home />}
        {activePage.subscription && <Subscription />}
        {activePage.vault && <Vault />}
      </Box>
    </Box>
  );
}
