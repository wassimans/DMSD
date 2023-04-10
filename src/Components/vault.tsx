import { useDmsdApp } from "@/contexts/DmsdContext";
import {
  useDmsdTransferToMultisig,
  usePrepareDmsdTransferToMultisig,
} from "@/generated";
import {
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useWaitForTransaction } from "wagmi";
import Multisig from "./multisig";

export default function Vault() {
  const {
    state: { contractAddress, userAddress, currentUser, vaultApproved },
    dispatch,
  } = useDmsdApp();

  const amount: BigNumber = BigNumber.from("1");

  const { config } = usePrepareDmsdTransferToMultisig({
    address: contractAddress,
    overrides: {
      from: userAddress,
      gasLimit: BigNumber.from("10000000"),
    },
    // overrides: {
    //   from: userAddress,
    // },
    chainId: 80001,
    args: [amount],
  });

  const { data, write } = useDmsdTransferToMultisig({
    ...config,
  });

  const handleApproveVault = (e: any) => {
    e.preventDefault();
    write?.();
  };

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      console.log("vault approved");
      dispatch({ type: "APPROVE_VAULT", payload: true });
      console.log("approvedVault", vaultApproved);
    },
  });

  return (
    <>
      {!currentUser?.subscribed && (
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
                lineHeight={2}
                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
              >
                Vous n'êtes souscris à aucuns services.
              </Heading>
              <Wrap justify="center" margin={5}>
                <WrapItem>
                  <Button
                    disabled={true}
                    onClick={() => {}}
                    colorScheme={"green"}
                    bg={"gray.700"}
                    rounded={"full"}
                    px={6}
                    _hover={{
                      bg: "green.500",
                    }}
                  >
                    Souscrire
                  </Button>
                </WrapItem>
              </Wrap>
            </Stack>
          </Stack>
        </Container>
      )}

      {currentUser?.subscribed && !vaultApproved && (
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
                lineHeight={2}
                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
              >
                Déclenchement de la procédure de protection de vos avoirs.
              </Heading>
              <Wrap justify="center" margin={5}>
                <WrapItem>
                  <Button
                    disabled={false}
                    onClick={(e) => handleApproveVault(e)}
                    colorScheme={"green"}
                    bg={"gray.700"}
                    rounded={"full"}
                    px={6}
                    _hover={{
                      bg: "green.500",
                    }}
                  >
                    Confirmer
                  </Button>
                </WrapItem>
              </Wrap>
            </Stack>
          </Stack>
        </Container>
      )}
      {vaultApproved && <Multisig />}
    </>
  );
}
