import { User, useDmsdApp } from "@/contexts/DmsdContext";
import {
  useDmsdGetRecoveryWallets,
  useDmsdGetUser,
  useDmsdGetWalletToProtect,
} from "@/generated";
import {
  TableContainer,
  Table,
  Tr,
  Th,
  Tfoot,
  Heading,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const {
    state: { contractAddress, currentUser },
    dispatch,
  } = useDmsdApp();
  const { address } = useAccount();

  const { data: userData } = useDmsdGetUser({
    address: contractAddress,
    args: [address!],
  });

  useEffect(() => {
    (async function () {
      if (userData) {
        const currentUser: User = {
          email: userData?.username,
          username: userData?.userEmail,
          isAdmin: userData?.isAdmin,
          isRegistered: userData?.isRegistered,
          subscribed: userData?.subscribed,
        };
        dispatch({ type: "ADD_USER", payload: currentUser });
      }
    })();
  }, [userData]);

  const { data: recoveryWallets } = useDmsdGetRecoveryWallets({
    address: contractAddress,
    overrides: { from: address! },
  });

  const { data: walletToProtect } = useDmsdGetWalletToProtect({
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
              <Th>{currentUser?.username}</Th>
            </Tr>
            <Tr>
              <Th fontSize={"l"}>Email</Th>
              <Th>{currentUser?.email}</Th>
            </Tr>
            <Tr>
              <Th fontSize={"l"}>Votre wallet à protéger</Th>

              <Th>
                {walletToProtect !==
                ("0x0000000000000000000000000000000000000000" as `0x${string}`)
                  ? walletToProtect
                  : "N/A"}
              </Th>
            </Tr>
            <Tr>
              <Th fontSize={"l"}>Vos wallets de récupération</Th>

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
                {currentUser?.subscribed
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
