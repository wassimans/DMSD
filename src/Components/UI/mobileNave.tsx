import {
  IconButton,
  Flex,
  useColorModeValue,
  Text,
  FlexProps,
} from "@chakra-ui/react";
import { FiHome, FiMenu } from "react-icons/fi";
import { SlWallet } from "react-icons/sl";
import { MdAccountBalance } from "react-icons/md";
import { IconType } from "react-icons";

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Accueil", icon: FiHome },
  { name: "Souscriptions", icon: MdAccountBalance },
  { name: "Wallets", icon: SlWallet },
];

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
export default function MobileNave({ onOpen, ...rest }: MobileProps) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        DMSD
      </Text>
    </Flex>
  );
}
