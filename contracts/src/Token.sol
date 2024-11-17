// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    uint256 public cap;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _cap
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(_cap > 0, "Cap must be greater than zero");
        cap = _cap;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= cap, "Cap exceeded");
        _mint(to, amount);
    }

    function burnFrom(address from, uint256 amount) external {
        _burn(from, amount);
    }
}
