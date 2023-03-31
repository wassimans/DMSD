import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import { App } from "./App";
import { chains, client } from "./wagmi";

/**
 * Root providers and initialization of app
 * @see https://reactjs.org/docs/strict-mode.html
 * @see https://wagmi.sh/react/WagmiConfig
 * @see https://www.rainbowkit.com/docs/installation
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <div className="min-h-screen bg-gray-800">
            <App />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  </React.StrictMode>,
);
