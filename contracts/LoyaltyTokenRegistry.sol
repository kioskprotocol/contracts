pragma solidity ^0.4.11;

import "./LoyaltyToken.sol";

/** @title Creates loyalty tokens. */
contract LoyaltyTokenRegistry {
    uint256 public decimals = 18;              // Amount of decimals for display purposes. 
    address public rewards;                    // Address of the Rewards contract.

    // Loyalty token address => Valid
    mapping (address => bool) public whitelist;

    event NewToken(
        string name,
        string symbol,
        address indexed merchant,
        address indexed token
    );

    // Constructor
    function LoyaltyTokenRegistry(address _rewards) public {
        rewards = _rewards;
    }

    // Create a new loyalty token and update the whitelist.
    function createToken(
        string name,
        string symbol,
        uint256 initialSupply,
        address merchant
    ) 
        public 
    {
        LoyaltyToken token = new LoyaltyToken(
            name,
            symbol,
            merchant,
            initialSupply * 10 ** decimals,
            rewards
        );
        whitelist[token] = true;
        NewToken(name, symbol, merchant, token);
    }

}