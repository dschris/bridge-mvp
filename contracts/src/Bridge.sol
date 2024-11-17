// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "./Token.sol";

contract Bridge is Ownable {
    Token public token; // Reference to the custom Token contract
    string public chainName; // Name of the current chain (e.g., "Sepolia" or "Base")

    event TokenBurned(address indexed from, uint256 amount, string targetChain);
    event TokenMinted(address indexed to, uint256 amount, string sourceChain);

    constructor(
        address tokenAddress,
        string memory _chainName
    ) Ownable(msg.sender) {
        token = Token(tokenAddress); // Explicitly cast to Token
        chainName = _chainName;
    }

    // Burn tokens on the source chain
    function burn(uint256 amount, string memory targetChain) external {
        require(amount > 0, "Amount must be greater than zero");

        // Burn tokens from the user
        ERC20Burnable(address(token)).burnFrom(msg.sender, amount);

        emit TokenBurned(msg.sender, amount, targetChain);
    }

    // Mint tokens on the destination chain
    function mint(
        address to,
        uint256 amount,
        string memory sourceChain
    ) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");

        // Mint tokens to the recipient
        token.mint(to, amount);

        emit TokenMinted(to, amount, sourceChain);
    }
}
