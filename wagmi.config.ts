import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

/**
 * Wagmi cli will automatically generate react hooks from your forge contracts
 * @see https://wagmi.sh/cli/getting-started
 * You can also generate hooks from etherscan
 * @see https://wagmi.sh/cli/plugins/etherscan
 * Or for erc20 erc721 tokens
 * @see https://wagmi.sh/cli/plugins/erc
 * Or from hardhat
 * @see https://wagmi.sh/cli/plugins/hardhat
 * Or from an arbitrary fetch request
 * @see https://wagmi.sh/cli/plugins/fetch
 *
 * You can also generate vanilla actions for @wagmi/core
 * @see https://wagmi.sh/cli/plugins/actions
 */
export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    /**
     * Generates react hooks from your forge contracts
     * @see https://wagmi.sh/cli/plugins/foundry
     */
    foundry({
      deployments: {
        Local: {
          [chains.foundry.id]: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        },
      },
    }),
    /**
     * Generates react hooks from your abis
     * @see https://wagmi.sh/cli/plugins/react
     */
    react(),
  ],
});
