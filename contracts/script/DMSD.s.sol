// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/DMSD.sol";

contract DMSDScript is Script {
    // WMATIC token address in MUMBAI testnet
    address public constant WMATIC = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;

    /// @notice The main script entrypoint
    function run() external {
        // uint256 deployerPrivateKey = vm.envUint("GOERLI_PRIVATE_KEY");
        // vm.startBroadcast(deployerPrivateKey);
        vm.startBroadcast();
        // Create a new DMSD contract
        DMSD dmsd = new DMSD();
        // Set the dToken address to WMATIC on Goerli testnet
        dmsd.setToken(WMATIC);

        vm.stopBroadcast();
    }
}
