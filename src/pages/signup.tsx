import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";

export default function Signup() {
  const contract_address = "0x296bb848a0333B21DfF875BE7d07361A18738727";
  const { address, isConnecting, isDisconnected } = useAccount();
  return (
    <Container
      as={SimpleGrid}
      justifyItems="center"
      maxW={"7xl"}
      columns={{ base: 1, md: 1 }}
      spacing={{ base: 10, lg: 32 }}
      py={{ base: 10, sm: 20, lg: 32 }}
    >
      <Stack
        bg={"gray.50"}
        rounded={"xl"}
        p={{ base: 4, sm: 6, md: 8 }}
        spacing={{ base: 8 }}
        minW={{ lg: "lg" }}
      >
        <Stack spacing={4}>
          <Heading
            color={"gray.700"}
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
          >
            Inscription
          </Heading>
        </Stack>
        <Box as={"form"} mt={10} w="100%">
          <Stack spacing={4}>
            <Input
              placeholder="Nom"
              bg={"gray.100"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
            />
            <Input
              placeholder="Prénom"
              bg={"gray.100"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
            />
            <Input
              placeholder="email"
              bg={"gray.100"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
            />
            <Input
              placeholder="Votre wallet"
              bg={"gray.100"}
              border={0}
              color={"gray.500"}
              mb={8}
              _placeholder={{
                color: "gray.500",
              }}
            />
            <Text
              as={"span"}
              color={"gray.700"}
              lineHeight={1}
              fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
              _placeholder={{
                color: "gray.500",
              }}
            >
              Finalisez votre inscription en souscrivant à nos services
            </Text>
          </Stack>
          <Button
            fontFamily={"heading"}
            mt={8}
            w={"full"}
            backgroundColor="green.400"
            color={"white"}
            _hover={{
              bg: "green.500",
            }}
          >
            Suivant
          </Button>
        </Box>
        form
      </Stack>
    </Container>
  );
}
