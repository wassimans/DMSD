// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/DMSD.sol";

contract DMSDScript is Script {
    address MATIC_TOKEN_CONTRACT_ADDRESS = 0x0000000000000000000000000000000000001010;

    /// @notice The main script entrypoint
    /// @return dmsd The deployed contract
    function run() external returns (DMSD dmsd) {
        vm.startBroadcast();
        dmsd = new DMSD(MATIC_TOKEN_CONTRACT_ADDRESS);
        vm.stopBroadcast();
    }
}
