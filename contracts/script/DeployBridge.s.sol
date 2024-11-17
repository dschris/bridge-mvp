// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Bridge.sol";

contract DeployBridge is Script {
    function run() external {
        address tokenAddress = vm.envAddress("ANVIL_TOKEN_CA");
        string memory network = vm.envString("NETWORK"); // Get the network name

        vm.startBroadcast();

        // Deploy the Bridge contract
        Bridge bridge = new Bridge(tokenAddress, network);
        console.log("Bridge deployed at:", address(bridge));

        vm.stopBroadcast();
    }
}
