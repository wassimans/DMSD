import { useDmsdApp } from "@/contexts/DmsdContext";
import {
  useDmsdCreatePersonalMultisig,
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
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { useWaitForTransaction } from "wagmi";

export default function Subscribe() {
  const {
    state: { contractAddress, userAddress, currentUser },
  } = useDmsdApp();

  const [walletToProtect, setWalletToProtect] = useState("0x" as `0x${string}`);
  const [recoveryWallet1, setRecoveryWallet1] = useState("0x" as `0x${string}`);
  const [recoveryWallet2, setRecoveryWallet2] = useState("0x" as `0x${string}`);

  const debouncedWalletToProtect = useDebounce(walletToProtect, 500);
  const debouncedRecoveryWallet1 = useDebounce(recoveryWallet1, 500);
  const debouncedRecoveryWallet2 = useDebounce(recoveryWallet2, 500);

  const recoveryWallets: [`0x${string}`, `0x${string}`] = [
    debouncedRecoveryWallet1,
    debouncedRecoveryWallet2,
  ];

  const handleWalletToProtect = (e: any) => {
    e.preventDefault();
    setWalletToProtect(e.target.value);
  };

  const handleRecoveryWallet1 = (e: any) => {
    e.preventDefault();
    setRecoveryWallet1(e.target.value);
  };

  const handleRecoveryWallet2 = (e: any) => {
    e.preventDefault();
    setRecoveryWallet2(e.target.value);
  };

  const { config } = usePrepareDmsdCreatePersonalMultisig({
    address: contractAddress,
    args: [recoveryWallets, debouncedWalletToProtect],
  });

  const { data, write } = useDmsdCreatePersonalMultisig({
    ...config,
  });

  const reInitFields = () => {
    setWalletToProtect("0x" as `0x${string}`);
    setRecoveryWallet1("0x" as `0x${string}`);
    setRecoveryWallet2("0x" as `0x${string}`);
  };

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => reInitFields(),
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
        <Box as={"form"} mt={10} w="100%">
          <Stack spacing={4}>
            <Text fontSize={20}>Wallet à protéger : </Text>
            <Input
              placeholder="Votre pseudo"
              bg={"gray.20"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
              value={walletToProtect}
              onChange={(e) => handleWalletToProtect(e)}
            />
            <Divider />
            <Text fontSize={20}>Wallets de récupération : </Text>
            <Input
              placeholder="Votre pseudo"
              bg={"gray.20"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
              value={recoveryWallet1}
              onChange={(e) => handleRecoveryWallet1(e)}
            />
            <Input
              placeholder="Votre pseudo"
              bg={"gray.20"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
              value={recoveryWallet2}
              onChange={(e) => handleRecoveryWallet2(e)}
            />
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
