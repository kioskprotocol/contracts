pragma solidity ^0.4.11;

import "./MarketToken.sol";
import "./LoyaltyToken.sol";
import "./LoyaltyTokenRegistry.sol";

contract Rewards {
    MarketToken public marketToken;
    LoyaltyTokenRegistry public registry;
    address public owner;

    // Checkout address => Valid
    mapping (address => bool) public validCheckouts;

    event LogError(string error);

    modifier only_owner {
        require(owner == msg.sender);
        _;
    }

    modifier only_checkout {
        require(validCheckouts[msg.sender] == true);
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
        if (registry.whitelist(token) == false || LoyaltyToken(token).owner() != from) {
            return false;
        }

        LoyaltyToken(token).reward(to, amount);
        return true;
    }

    function redeemLoyaltyTokens(address token, address buyer, uint256 amount)
        public
        only_checkout
        returns (bool)
    {
        if (registry.whitelist(token) == false) {
            LogError("Invalid loyalty token");
            return false;
        }

        LoyaltyToken(token).redeem(buyer, amount);
        return true;
    }

    function addCheckout(address _checkout) public only_owner returns (bool) {
        validCheckouts[_checkout] = true;
        return true;
    }

    function removeCheckout(address _checkout) public only_owner returns (bool) {
        validCheckouts[_checkout] = false;
        return true;
    }

    function setOwner(address _owner) public only_owner {
        owner = _owner;
    }

}