// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Token.sol";

contract Deploy is Script {
    function run() external {
        string memory network = vm.envString("NETWORK"); // Get the network name
        uint256 privateKey = vm.envUint("ANVIL_PRIVATE_KEY");

        // Choose RPC URL based on network
        string memory rpcUrl;
        if (
            keccak256(abi.encodePacked(network)) ==
            keccak256(abi.encodePacked("sepolia"))
        ) {
            rpcUrl = vm.envString("SEPOLIA_RPC_URL");
            console.log("Deploying to Sepolia...");
        } else if (
            keccak256(abi.encodePacked(network)) ==
            keccak256(abi.encodePacked("base"))
        ) {
            rpcUrl = vm.envString("BASE_RPC_URL");
            console.log("Deploying to Base...");
        } else if (
            keccak256(abi.encodePacked(network)) ==
            keccak256(abi.encodePacked("anvil_a"))
        ) {
            rpcUrl = vm.envString("ANVIL_A_RPC_URL");
            console.log("Deploying to Anvil A...");
        } else if (
            keccak256(abi.encodePacked(network)) ==
            keccak256(abi.encodePacked("anvil_b"))
        ) {
            rpcUrl = vm.envString("ANVIL_B_RPC_URL");
            console.log("Deploying to Anvil B...");
        } else {
            revert("Unsupported network! Use 'sepolia' or 'base'.");
        }

        // Set the RPC URL and start broadcasting
        vm.startBroadcast(privateKey);

        // Deploy the token contract
        Token token = new Token("BridgeToken", "BRT", 1_000_000 * 1e18);
        console.log("Token deployed at:", address(token));

        vm.stopBroadcast();
    }
}
