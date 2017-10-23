pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract MarketToken is StandardToken {
    string public name = "Market Token";            // Set the name for display purposes.
    string public symbol = "MARK";                  // Set the symbol for display purposes.
    uint256 public decimals = 18;                   // Amount of decimals for display purposes.
    address public checkout;                        // The address of the Checkout contract.
    address public owner;

    modifier only_owner {
        require(owner == msg.sender);
        _;
    }

    modifier only_checkout {
        require(checkout == msg.sender);
        _;
    }

    // Logged when the owner changes.
    event NewOwner(address indexed owner);

    // Logged when the Buy contract changes.
    event NewBuy(address indexed buy);
    
    // Constructor
    function MarketToken(uint256 _totalSupply) {
        // Give the initial balance to the contract deployer.
        balances[msg.sender] = _totalSupply;
        totalSupply = _totalSupply;            
        owner = msg.sender;
    }

    function transferFromCheckout
    (
        address _from,
        address _to,
        uint256 _value
    ) 
        only_checkout
        returns (bool) 
    {
        // Allow the Buy contract to spend a user's balance.
        balances[_to] = balances[_to].add(_value);
        balances[_from] = balances[_from].sub(_value);
        Transfer(_from, _to, _value);
        return true;
    }

    function setOwner(address _owner) only_owner {
        owner = _owner;
    }

    function setCheckout(address _checkout) only_owner {
        checkout = _checkout;
    }

}