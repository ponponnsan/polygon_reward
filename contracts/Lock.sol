// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract hachiToken is ERC20, Ownable {
    constructor() ERC20("Hachi", "HC") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    function sendTo(address to, uint256 amount) public onlyOwner {
        _mint(to , amount);
    }
}
