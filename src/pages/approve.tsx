import { useDmsdApp } from "@/contexts/DmsdContext";
import {
  useDmsdApproveTransfer,
  useDmsdGetApprovals,
  useDmsdGetApprovalsFromWalletToProtect,
  useDmsdGetPersonalMultiSig,
  usePrepareDmsdApproveTransfer,
} from "@/generated";
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Button,
  SimpleGrid,
  Wrap,
  WrapItem,
  Tag,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useAccount, useWaitForTransaction } from "wagmi";

export default function Approve() {
  const {
    state: { contractAddress },
  } = useDmsdApp();

  const { address } = useAccount();

  const { data: approvalStatus, refetch } =
    useDmsdGetApprovalsFromWalletToProtect({
      address: contractAddress,
      overrides: { from: address },
    });

  const { data: multisigWallet } = useDmsdGetPersonalMultiSig({
    address: contractAddress,
  });

  const { config } = usePrepareDmsdApproveTransfer({
    address: contractAddress,
    overrides: { from: address, gasLimit: BigNumber.from("1000000") },
  });

  const { data, write } = useDmsdApproveTransfer(config);

  const handleApproveVault = (e: any) => {
    e.preventDefault();
    write?.();
  };

  console.log("approvalStatus", approvalStatus);

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => refetch(),
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
            fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
          >
            Approval en attente :
          </Heading>
          <Text fontSize={20}>Le spender (DMSD) : {contractAddress}</Text>
          <Text fontSize={20}>
            Le receiver (votre wallet MultiSig) : {multisigWallet}
          </Text>
          {approvalStatus && (
            <Text fontSize={20}>
              Statut de l'approval :{" "}
              <Tag size={"lg"} key={"lg"} variant="solid" colorScheme="teal">
                Approuvé
              </Tag>
            </Text>
          )}
          {!approvalStatus && (
            <Text fontSize={20}>
              Statut de l'approval :{" "}
              <Tag size={"lg"} key={"lg"} variant="solid" colorScheme="red">
                Non Approuvé
              </Tag>
            </Text>
          )}
        </Stack>
        <Box as={"form"} mt={10} w="100%">
          <Stack spacing={4}></Stack>
          <Wrap justify="center" margin={5}>
            <WrapItem>
              <Button
                onClick={(e) => handleApproveVault(e)}
                colorScheme={"green"}
                bg={"gray.700"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "green.500",
                }}
              >
                Approuver
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
