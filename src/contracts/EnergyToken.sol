// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoltToken is ERC20, Ownable {
    mapping(address => uint256) public energyContributions;
    
    event EnergyContributed(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor() ERC20("VOLT", "VOLT") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function contributeEnergy(uint256 kwhAmount) external {
        require(kwhAmount > 0, "Must contribute positive energy amount");
        energyContributions[msg.sender] += kwhAmount;
        
        // Reward calculation: 1 kWh = 2 VOLT tokens
        uint256 rewardAmount = kwhAmount * 2 * 10**decimals();
        _mint(msg.sender, rewardAmount);
        
        emit EnergyContributed(msg.sender, kwhAmount);
        emit RewardsClaimed(msg.sender, rewardAmount);
    }

    function getEnergyContribution(address user) external view returns (uint256) {
        return energyContributions[user];
    }
}