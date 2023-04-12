import { useDmsdApp } from "@/contexts/DmsdContext";
import {
  useDmsdCreatePersonalMultisig,
  useDmsdGetPersonalMultiSig,
  useDmsdGetPersonalMultiSigBalance,
  useDmsdGetWalletToProtect,
  useDmsdTransferFromToMultisig,
  useMultiSigWalletGetOwners,
  usePrepareDmsdCreatePersonalMultisig,
  usePrepareDmsdTransferFromToMultisig,
} from "@/generated";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem,
  ButtonGroup,
  IconButton,
  Divider,
  TableContainer,
  Table,
  Tfoot,
  Tr,
  Th,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useAccount, useSigner, useWaitForTransaction } from "wagmi";

export default function Multisig() {
  const {
    state: { contractAddress },
  } = useDmsdApp();

  const { data: signer } = useSigner();

  const { address: userAddress } = useAccount();

  const { data: multisigAddress } = useDmsdGetPersonalMultiSig({
    address: contractAddress,
  });

  const { data: owners } = useMultiSigWalletGetOwners({
    address: multisigAddress,
  });

  const { data: balanceMultiSig, refetch } = useDmsdGetPersonalMultiSigBalance({
    address: contractAddress,
  });

  const { data: walletToProtect } = useDmsdGetWalletToProtect({
    address: contractAddress,
    overrides: { from: userAddress! },
  });

  const { config } = usePrepareDmsdTransferFromToMultisig({
    address: contractAddress,
    overrides: { gasLimit: BigNumber.from(1000000) },
    args: [BigNumber.from(1000000000000)],
    signer: contractAddress,
  });

  console.log("balanceMultiSig", balanceMultiSig);

  const { data, write } = useDmsdTransferFromToMultisig(config);

  const handleTransfer = (e: any) => {
    e.preventDefault();
    write?.();
  };

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      console.log("success");
      refetch();
    },
  });

  return (
    <>
      <Heading
        color={"gray.700"}
        lineHeight={2}
        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
      >
        Gérer votre vault multisig personnel
      </Heading>
      <Heading
        color={"gray.700"}
        lineHeight={2}
        fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
      >
        List des propriétaires de votre vault
      </Heading>
      <br />
      <Text fontSize={20}>
        2/3 vos adresses de récupération et 1/3 l'adresse du contrat DMSD
      </Text>
      <br />
      <TableContainer>
        <Table variant="striped" colorScheme="green.500">
          <Tfoot>
            <Tr>
              <Th fontSize={"l"}>Vos wallets de récupération</Th>

              <Th>
                {owners?.[0] !==
                ("0x0000000000000000000000000000000000000000" as `0x${string}`)
                  ? owners?.[0]
                  : "N/A"}
              </Th>
            </Tr>
            <Tr>
              <Th></Th>
              <Th>
                {owners?.[1] !==
                ("0x0000000000000000000000000000000000000000" as `0x${string}`)
                  ? owners?.[1]
                  : "N/A"}
              </Th>
            </Tr>
            <Tr>
              <Th fontSize={"l"}>L'adresse du contrat DMSD</Th>
              <Th>{contractAddress}</Th>
            </Tr>
            <Tr>
              <Th fontSize={"l"}>Nombre de confirmations requises : </Th>
              <Th>2/3</Th>
            </Tr>
            <Tr>
              <Th fontSize={"l"}>Balance du MultiSig : </Th>
              <Th>
                <Text fontSize={20} as={"span"}>
                  {balanceMultiSig?.toString()}
                </Text>
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      <Divider />
      <br />
      <Button
        disabled={false}
        onClick={(e) => handleTransfer(e)}
        colorScheme={"green"}
        bg={"gray.700"}
        rounded={"full"}
        px={6}
        _hover={{
          bg: "green.500",
        }}
      >
        Transférer mes avoirs vers le MultiSig
      </Button>
      <Divider />
    </>
  );
}
