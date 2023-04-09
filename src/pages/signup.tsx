import { useDmsdApp } from "@/contexts/DmsdContext";
import {
  useDmsd,
  useDmsdRegisterAdmin,
  usePrepareDmsdRegisterAdmin,
} from "@/generated";
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
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export default function Signup() {
  const router = useRouter();
  const {
    state: { contractAddress, userAddress },
  } = useDmsdApp();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const contract = useDmsd();

  // useWaitForTransaction({
  //   hash: data?.hash,
  //   onSuccess: () => refetch(),
  // });

  const handleUsername = (e: any) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const { config } = usePrepareDmsdRegisterAdmin({
    address: contractAddress,
    args: [username, email],
  });

  const { data, status, write, isLoading, isSuccess, writeAsync } =
    useDmsdRegisterAdmin({
      ...config,
    });

  const handleValidate = async () => {
    write?.();

    // writeAsync?.();
    // try {
    //   const response = await contract?.registerAdmin(username, email);
    //   console.log(response);
    //   router.push("/dmsd");
    // } catch (error) {
    //   alert(error);
    // }
  };

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
                onClick={handleValidate}
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
function disconnectAsync() {
  throw new Error("Function not implemented.");
}
