pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/token/StandardToken.sol";
import "./LoyaltyTokenRegistry.sol";

/** @title Loyalty token that merchants can create and accept in place of Ether. */
contract LoyaltyToken is StandardToken {
    string public name;                         // Set the name for display purposes.
    string public symbol;                       // Set the symbol for display purposes.
    uint256 public decimals = 18;               // Amount of decimals for display purposes.
    address public owner;
    LoyaltyTokenRegistry public registry;       // The registry used to create this contract.

    modifier only_checkout {
        require(registry.checkout() == msg.sender);
        _;
    }

    modifier only_owner {
        require(owner == msg.sender);
        _;
    }
    
    // Constructor
    function LoyaltyToken(
        string _name,
        string _symbol,
        address _owner,
        uint256 _totalSupply,
        LoyaltyTokenRegistry _registry
    ) 
        public
    {
        name = _name;
        symbol = _symbol;
        owner = _owner;
        registry = _registry;

        // Give the initial balance to the DIN owner.
        balances[_owner] = _totalSupply;
        totalSupply = _totalSupply;            
    }

    function redeem(address _from, uint256 _value) public only_checkout returns (bool) {
        balances[_from] = balances[_from].sub(_value);
        Transfer(_from, address(0x0), _value);
    }

    function reward(address _who, uint256 _value) public only_checkout returns (bool) {
        totalSupply = totalSupply.add(_value);
        balances[_who] = balances[_who].add(_value);
        Transfer(address(0x0), _who, _value);
        return true;
    }

    function setOwner(address _owner) only_owner {
        owner = _owner;
    }

}