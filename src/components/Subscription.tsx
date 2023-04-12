import { useDmsdApp } from "@/contexts/DmsdContext";
import {
  useDmsdCreatePersonalMultisig,
  useDmsdSubscribeAdmin,
  usePrepareDmsdCreatePersonalMultisig,
  usePrepareDmsdSubscribeAdmin,
} from "@/generated";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Tab,
  Text,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Wrap,
  WrapItem,
  ButtonGroup,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { useWaitForTransaction } from "wagmi";
import Subscribe from "./subscribe";
import { BigNumber } from "ethers";

export default function Subscription() {
  const {
    state: { contractAddress, userAddress, currentUser },
    dispatch,
  } = useDmsdApp();

  const { config } = usePrepareDmsdSubscribeAdmin({
    address: contractAddress,
    // overrides: { from: userAddress, gasLimit: BigNumber.from("1000000") },
    overrides: { from: userAddress },
  });

  const { data, write } = useDmsdSubscribeAdmin({
    ...config,
  });

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      dispatch({ type: "SUBSCRIBE_USER", payload: true });
    },
  });

  return (
    <Tabs isFitted variant="enclosed">
      <TabList mb="1em">
        <Tab _selected={{ color: "white", bg: "gray.700" }}>
          Pertes des accès
        </Tab>
        <Tab _selected={{ color: "white", bg: "gray.700" }}>
          Cas de disparition
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {!currentUser.subscribed && (
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
                    Peur de perdre vos accès, n'ayez crainte nous avons la
                    solution.
                  </Heading>
                  <Wrap justify="center" margin={5}>
                    <WrapItem>
                      <Button
                        disabled={false}
                        onClick={() => write?.()}
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

          {currentUser.subscribed && <Subscribe />}
        </TabPanel>
        <TabPanel>
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
                  Protection de vos avoirs en cas de disparition.
                </Heading>
                <Wrap justify="center" margin={5}>
                  <WrapItem>
                    <Button
                      disabled={true}
                      onClick={() => write?.()}
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
        </TabPanel>
      </TabPanels>
    </Tabs>
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
