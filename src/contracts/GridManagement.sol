// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract GridManagement is AccessControl {
    bytes32 public constant GRID_OPERATOR = keccak256("GRID_OPERATOR");
    
    struct GridMetrics {
        uint256 stability;     // 0-100%
        uint256 networkLoad;   // 0-100%
        uint256 securityStatus; // 0-100%
        uint256 activeContracts;
        uint256 timestamp;
    }
    
    GridMetrics public currentMetrics;
    mapping(address => bool) public verifiedProducers;
    
    event MetricsUpdated(
        uint256 stability,
        uint256 networkLoad,
        uint256 securityStatus,
        uint256 activeContracts
    );
    event ProducerVerified(address indexed producer);
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GRID_OPERATOR, msg.sender);
    }
    
    function updateGridMetrics(
        uint256 stability,
        uint256 networkLoad,
        uint256 securityStatus,
        uint256 activeContracts
    ) external onlyRole(GRID_OPERATOR) {
        require(stability <= 100, "Invalid stability value");
        require(networkLoad <= 100, "Invalid network load value");
        require(securityStatus <= 100, "Invalid security status value");
        
        currentMetrics = GridMetrics({
            stability: stability,
            networkLoad: networkLoad,
            securityStatus: securityStatus,
            activeContracts: activeContracts,
            timestamp: block.timestamp
        });
        
        emit MetricsUpdated(stability, networkLoad, securityStatus, activeContracts);
    }
    
    function verifyProducer(address producer) external onlyRole(GRID_OPERATOR) {
        verifiedProducers[producer] = true;
        emit ProducerVerified(producer);
    }
    
    function getGridMetrics() external view returns (GridMetrics memory) {
        return currentMetrics;
    }
}