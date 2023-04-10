import { useDmsdApp } from "@/contexts/DmsdContext";
import {
  useDmsdCreatePersonalMultisig,
  useMultiSigWalletGetOwners,
  usePrepareDmsdCreatePersonalMultisig,
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
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { useWaitForTransaction } from "wagmi";

export default function Multisig() {
  const {
    state: { contractAddress, userAddress, currentUser },
  } = useDmsdApp();

  const { data: owners } = useMultiSigWalletGetOwners({
    address: contractAddress,
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
      <Text fontSize={20}>
        2/3 vos adresses de récupération et 1/3 l'adresse du contrat DMSD
      </Text>
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
          </Tfoot>
        </Table>
      </TableContainer>
      <Divider />
      <ButtonGroup size="lg" isAttached variant="outline">
        <Button bg={"white"} fontWeight={"normal"}>
          Créer une transaction
        </Button>
        <IconButton
          bg={"white"}
          fontSize={40}
          aria-label="Add transaction"
          icon={<IoIosAddCircle />}
        />
      </ButtonGroup>
      <Divider />
    </>
  );
}
