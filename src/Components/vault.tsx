import { useDmsdApp } from "@/contexts/DmsdContext";
import {
  Button,
  Container,
  Divider,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useAccount, useWaitForTransaction } from "wagmi";
import Multisig from "./multisig";
import {
  useDmsdGetApprovals,
  useDmsdValidateApproval,
  usePrepareDmsdValidateApproval,
} from "@/generated";
import { useState } from "react";

export default function Vault() {
  const {
    state: { contractAddress, currentUser },
    dispatch,
  } = useDmsdApp();

  const { address: userAddress } = useAccount();

  console.log("userAddress", userAddress);

  const amount: BigNumber = BigNumber.from("1");

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { data: vaultApproved } = useDmsdGetApprovals({
    address: contractAddress,
    overrides: { from: userAddress },
  });

  const { config } = usePrepareDmsdValidateApproval({
    address: contractAddress,
    overrides: { from: userAddress },
  });

  const { write, data } = useDmsdValidateApproval(config);

  const handleApproveVault = (e: any) => {
    e.preventDefault();
    write?.();
  };

  console.log("approvedVault", vaultApproved);

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      setShowSuccessMessage(true);
      // dispatch({ type: "APPROVE_VAULT", payload: true });
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
              {showSuccessMessage && (
                <>
                  <Divider />
                  <Text fontSize={20} textAlign={"center"}>
                    Vault validé ! Vous pouvez maintenant Approve DMSD pour la
                    gestion de vos avoirs.
                  </Text>
                  <br />
                  <Text fontSize={20} textAlign={"center"}>
                    Connectez-vous avec votre wallet à protéger pour pouvoir
                    Approve.
                  </Text>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      )}
      {vaultApproved && <Multisig />}
    </>
  );
}
