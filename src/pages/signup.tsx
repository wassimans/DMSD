import { useDmsdApp } from "@/contexts/DmsdContext";
import { useDmsdRegisterAdmin, usePrepareDmsdRegisterAdmin } from "@/generated";
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWaitForTransaction } from "wagmi";

export default function Signup() {
  const router = useRouter();
  const {
    state: { contractAddress, userAddress },
  } = useDmsdApp();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const debouncedUsername = useDebounce(username, 500);
  const debouncedEmail = useDebounce(email, 500);

  const handleUsername = (e: any) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handleEmail = (e: any) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const { config } = usePrepareDmsdRegisterAdmin({
    address: contractAddress,
    args: [debouncedUsername, debouncedEmail],
    // overrides: { from: userAddress, gasLimit: BigNumber.from("1000000") },
    overrides: { from: userAddress },
  });

  const { data, write } = useDmsdRegisterAdmin({
    ...config,
  });

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => router.push("/dmsd"),
  });

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
        bg={"gray.100"}
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
              placeholder="Votre pseudo"
              bg={"gray.20"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
              value={username}
              onChange={(e) => {
                handleUsername(e);
              }}
            />
            <Input
              placeholder="email"
              type="email"
              bg={"gray.20"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
              value={email}
              onChange={(e) => {
                handleEmail(e);
              }}
            />
            <Text
              as={"span"}
              color={"gray.700"}
              lineHeight={1}
              fontSize={{ base: "l", sm: "xl", md: "2xl" }}
              _placeholder={{
                color: "gray.500",
              }}
            >
              Finalisez votre inscription
            </Text>
          </Stack>
          <Wrap justify="center" margin={5}>
            <WrapItem>
              <Button
                disabled={!write}
                onClick={() => write?.()}
                colorScheme={"green"}
                bg={"gray.700"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "green.500",
                }}
              >
                Valider
              </Button>
            </WrapItem>
          </Wrap>
        </Box>
        form
      </Stack>
    </Container>
  );
}

function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
