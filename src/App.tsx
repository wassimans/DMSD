import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Container } from "@chakra-ui/react";

import { Counter } from "./components";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();

  return (
    <>
      <ConnectButton />
      <Container>
        {isConnected && (
          <>
            <Counter />
          </>
        )}
      </Container>
    </>
  );
}
