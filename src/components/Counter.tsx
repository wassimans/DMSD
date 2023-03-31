import { useWaitForTransaction } from "wagmi";
import { Stack, Button, Text } from "@chakra-ui/react";
/**
 * These react hooks are generated with the wagmi cli via `wagmi generate`
 * @see ROOT/wagmi.config.ts
 */
import {
  useCounterIncrement,
  useCounterNumber,
  usePrepareCounterIncrement,
} from "../generated";

/**
 * An example component using the attestation station
 */
export function Counter() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const { data: value, refetch } = useCounterNumber({
    address: contractAddress,
  });
  const { config } = usePrepareCounterIncrement({
    address: contractAddress,
  });
  const { data, write } = useCounterIncrement({
    ...config,
  });
  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => refetch(),
  });

  return (
    <div>
      <Stack align="center">
        <Button colorScheme="teal" size="md" onClick={() => write?.()}>
          Increment number
        </Button>
      </Stack>
      <Stack align="center">
        <Text fontSize="5xl">{value?.toString()}</Text>
        <Text fontSize="4xl">
          Gas fee: <span>{config.request?.gasLimit.toString()}</span>
        </Text>
      </Stack>
    </div>
  );
}
