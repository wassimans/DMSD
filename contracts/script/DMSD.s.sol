// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/DMSD.sol";

contract DMSDScript is Script {
    // DAI token address in GOERLI testnet
    address public constant DAI = 0x73967c6a0904aA032C103b4104747E88c566B1A2;

    /// @notice The main script entrypoint
    function run() external {
        // uint256 deployerPrivateKey = vm.envUint("GOERLI_PRIVATE_KEY");
        // vm.startBroadcast(deployerPrivateKey);
        vm.startBroadcast();
        // Create a new DMSD contract
        DMSD dmsd = new DMSD();
        // Set the dToken address to DAI on Goerli testnet
        dmsd.setToken(DAI);

        vm.stopBroadcast();
    }
}
