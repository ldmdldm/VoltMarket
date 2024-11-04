// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./EnergyToken.sol";

contract EnergyMarket {
    struct EnergyOffer {
        address seller;
        uint256 kwhAmount;
        uint256 pricePerKwh;
        bool active;
    }

    VoltToken public voltToken;
    mapping(uint256 => EnergyOffer) public energyOffers;
    uint256 public nextOfferId;
    
    event OfferCreated(uint256 indexed offerId, address seller, uint256 kwhAmount, uint256 pricePerKwh);
    event OfferPurchased(uint256 indexed offerId, address buyer, uint256 kwhAmount, uint256 totalPrice);
    
    constructor(address _voltToken) {
        voltToken = VoltToken(_voltToken);
    }
    
    function createOffer(uint256 kwhAmount, uint256 pricePerKwh) external {
        require(kwhAmount > 0, "Amount must be positive");
        require(pricePerKwh > 0, "Price must be positive");
        
        energyOffers[nextOfferId] = EnergyOffer({
            seller: msg.sender,
            kwhAmount: kwhAmount,
            pricePerKwh: pricePerKwh,
            active: true
        });
        
        emit OfferCreated(nextOfferId, msg.sender, kwhAmount, pricePerKwh);
        nextOfferId++;
    }
    
    function purchaseEnergy(uint256 offerId, uint256 kwhAmount) external {
        EnergyOffer storage offer = energyOffers[offerId];
        require(offer.active, "Offer not active");
        require(kwhAmount <= offer.kwhAmount, "Insufficient energy available");
        
        uint256 totalPrice = kwhAmount * offer.pricePerKwh;
        require(voltToken.transferFrom(msg.sender, offer.seller, totalPrice), "Transfer failed");
        
        offer.kwhAmount -= kwhAmount;
        if (offer.kwhAmount == 0) {
            offer.active = false;
        }
        
        emit OfferPurchased(offerId, msg.sender, kwhAmount, totalPrice);
    }
}