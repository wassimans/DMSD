import "@rainbow-me/rainbowkit/styles.css";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { WagmiConfig } from "wagmi";
import { client } from "../wagmi";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DmsdProvider } from "@/contexts/DmsdContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WagmiConfig client={client}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <DmsdProvider>
            <Component {...pageProps} />
          </DmsdProvider>
        </SessionProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
