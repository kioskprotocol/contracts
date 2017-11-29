pragma solidity ^0.4.11;

import "./LoyaltyToken.sol";

/** @title Creates loyalty tokens. */
contract LoyaltyTokenRegistry {

    uint256 public TOKEN_SUPPLY = 1000000000;  // Total supply of each loyalty token is 1 billion.
    uint256 public decimals = 18;              // Amount of decimals for display purposes. 
    address public checkout;                   // Address of the Checkout contract.
    address public owner;                      // The owner can update the Checkout contract.

    // Loyalty token address => Valid
    mapping (address => bool) public whitelist;

    modifier only_owner {
        require(owner == msg.sender);
        _;
    }

    event NewToken(
        string name,
        string symbol,
        address indexed merchant,
        address indexed token
    );

    // Constructor
    function LoyaltyTokenRegistry() public {
        owner = msg.sender;
    }

    // Create a new loyalty token and update the whitelist.
    function createToken(
        string name, 
        string symbol,
        address merchant
    ) 
        public 
    {
        LoyaltyToken token = new LoyaltyToken(
            name,
            symbol,
            merchant,
            TOKEN_SUPPLY * 10 ** decimals,
            this
        );
        whitelist[token] = true;
        NewToken(name, symbol, merchant, token);
    }

    function setOwner(address _owner) only_owner {
        owner = _owner;
    }

    function setCheckout(address _checkout) only_owner {
        checkout = _checkout;
    }

}