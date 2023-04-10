import { useDmsdApp } from "@/contexts/DmsdContext";
import { useDmsd, usePrepareDmsdRegisterAdmin } from "@/generated";
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
import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export default function Connect() {
  const { dispatch } = useDmsdApp();
  const router = useRouter();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    type Challenge = {
      id: string;
      profileId: string;
      message: string;
    };
    let message: string;
    let signature: `0x${string}`;
    let url: string;

    const response = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });

    if (response) {
      message = response.message;
      signature = await signMessageAsync({ message });
      dispatch({ type: "ADD_USER_ADDRESS", payload: account });
      // redirect user after success authentication to '/user' page
      const signInResponse = await signIn("moralis-auth", {
        message,
        signature,
        redirect: false,
        callbackUrl: "/signup",
      });

      if (signInResponse && signInResponse.url) {
        const { url } = signInResponse;
        /**
         * instead of using signIn(..., redirect: "/user")
         * we get the url from callback and push it to the router to avoid page refreshing
         */
        router.push(url);
      } else {
        // Handle the case when the response is undefined
        throw new Error("signIn response is undefined");
      }
    } else {
      // Handle the case when the response is undefined
      throw new Error("requestChallenge response is undefined");
    }
  };

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
            Connectez votre wallet
          </Heading>
        </Stack>
        <Box as={"form"} mt={10} w="100%">
          <Stack spacing={4}></Stack>
          <Wrap justify="center" margin={5}>
            <WrapItem>
              <Button
                onClick={handleAuth}
                colorScheme={"green"}
                bg={"gray.700"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "green.500",
                }}
              >
                Connectez-vous avec MetaMask
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
