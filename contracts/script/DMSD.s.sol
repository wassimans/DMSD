// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/DMSD.sol";

contract DMSDScript is Script {
    // DAI token address in MUMBAI testnet
    address public constant DAI = 0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F;

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
