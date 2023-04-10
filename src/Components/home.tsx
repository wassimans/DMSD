import { useDmsdApp } from "@/contexts/DmsdContext";
import { useDmsdGetRecoveryWallets, useDmsdGetUser } from "@/generated";
import {
  TableContainer,
  Table,
  Tr,
  Th,
  Tfoot,
  Heading,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";

export default function Home() {
  const {
    state: { contractAddress },
  } = useDmsdApp();
  const { address } = useAccount();

  const { data: userData } = useDmsdGetUser({
    address: contractAddress,
    args: [address!],
  });

  const { data: recoveryWallets } = useDmsdGetRecoveryWallets({
    address: contractAddress,
    overrides: { from: address! },
  });

  return (
    <>
      <Heading
        color={"gray.700"}
        lineHeight={2}
        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
      >
        Récapitulatif
      </Heading>
      <TableContainer>
        <Table variant="striped" colorScheme="green.500">
          <Tfoot>
            <Tr>
              <Th fontSize={"l"}>Pseudo</Th>
              <Th>{userData?.[1]}</Th>
            </Tr>
            <Tr>
              <Th fontSize={"l"}>Email</Th>
              <Th>{userData?.[0]}</Th>
            </Tr>
            <Tr>
              <Th fontSize={"l"}>Vos wallets protégés</Th>

              <Th>
                {recoveryWallets?.[0] !==
                ("0x0000000000000000000000000000000000000000" as `0x${string}`)
                  ? recoveryWallets?.[0]
                  : "N/A"}
              </Th>
            </Tr>
            <Tr>
              <Th></Th>
              <Th>
                {recoveryWallets?.[1] !==
                ("0x0000000000000000000000000000000000000000" as `0x${string}`)
                  ? recoveryWallets?.[1]
                  : "N/A"}
              </Th>
            </Tr>
            <Tr>
              <Th fontSize={"l"}>Services souscrits</Th>
              <Th>
                {recoveryWallets?.[0] !==
                ("0x0000000000000000000000000000000000000000" as `0x${string}`)
                  ? "Récupération des avoirs en cas de pertes des accès"
                  : "N/A"}
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
}
function useDmsdGetAtIndex(arg0: { address: any; args: number[] }): {
  data: any;
} {
  throw new Error("Function not implemented.");
}
