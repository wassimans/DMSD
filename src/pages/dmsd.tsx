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
import Wallets from "../Components/wallets";
import MobileNav from "../Components/UI/MobileNave";
import SidebarContent from "../Components/UI/SideBarContent";

export default function DMSD() {
  const [activePage, setActivePage] = useState({
    home: true,
    subscription: false,
    wallets: false,
    logout: false,
  });

  const handleActivePage = (name: string) => {
    switch (name) {
      case "Accueil":
        setActivePage({
          home: true,
          subscription: false,
          wallets: false,
          logout: false,
        });
        break;
      case "Souscriptions":
        setActivePage({
          home: false,
          subscription: true,
          wallets: false,
          logout: false,
        });
        break;
      case "Wallets":
        setActivePage({
          home: false,
          subscription: false,
          wallets: true,
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
        {activePage.wallets && <Wallets />}
      </Box>
    </Box>
  );
}
