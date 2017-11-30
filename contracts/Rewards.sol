pragma solidity ^0.4.11;

import "./MarketToken.sol";
import "./LoyaltyToken.sol";
import "./LoyaltyTokenRegistry.sol";

contract Rewards {
    MarketToken public marketToken;
    LoyaltyTokenRegistry public registry;
    address public owner;

    mapping (address => bool) public checkouts;

    modifier only_owner {
        require(owner == msg.sender);
        _;
    }

    modifier only_checkout {
        require(checkouts[msg.sender] == true);
        _;
    }

    // Constructor
    function Rewards(MarketToken _marketToken, LoyaltyTokenRegistry _registry) public {
        marketToken = _marketToken;
        registry = _registry;
        owner = msg.sender;
    }

    function sendAffiliateReward(address from, address to, uint256 amount) 
        public 
        only_checkout
        returns (bool)
    {
        marketToken.transferFromRewards(from, to, amount);
    }

    function sendLoyaltyReward(address token, address from, address to, uint256 amount) 
        public
        only_checkout
        returns (bool) 
    {
        if (isValidLoyaltyReward(token, from) == true) {
            LoyaltyToken(token).reward(to, amount);
            return true;
        }

        return false;
    }

    function redeemLoyaltyTokens(address token, address buyer, uint256 amount)
        public
        only_checkout
        returns (bool) 
    {
        if (registry.whitelist(token) == true) {
            LoyaltyToken(token).redeem(buyer, amount);
            return true;
        }

        return false;
    }

    function isValidLoyaltyReward(address token, address owner) public constant returns (bool) {
        return (registry.whitelist(token) == true && LoyaltyToken(token).owner() == owner);
    }

    function addCheckout(address checkout) public only_owner returns (bool) {
        checkouts[checkout] = true;
        return true;
    }

    function removeCheckout(address checkout) public only_owner returns (bool) {
        checkouts[checkout] = false;
        return true;
    }

    function setOwner(address _owner) public only_owner {
        owner = _owner;
    }

}