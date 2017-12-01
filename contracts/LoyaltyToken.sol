pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/token/StandardToken.sol";
import "./LoyaltyTokenRegistry.sol";

/** @title Loyalty token that merchants can create and accept in place of Ether. */
contract LoyaltyToken is StandardToken {
    string public name;                         // Set the name for display purposes.
    string public symbol;                       // Set the symbol for display purposes.
    uint256 public decimals = 18;               // Amount of decimals for display purposes.
    address public owner;
    address public rewards;

    modifier only_owner {
        require(owner == msg.sender);
        _;
    }

    modifier only_rewards {
        require(rewards == msg.sender);
        _;
    }
        
    // Constructor
    function LoyaltyToken(
        string _name,
        string _symbol,
        address _owner,
        uint256 _totalSupply,
        address _rewards
    ) 
        public
    {
        name = _name;
        symbol = _symbol;
        owner = _owner;
        rewards = _rewards;

        // Give the initial balance to the DIN owner.
        balances[_owner] = _totalSupply;
        totalSupply = _totalSupply;            
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        // Allow transfer of rewards, but not accumulation
        require(balanceOf(_to) == 0);
        BasicToken.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        // Allow transfer of rewards, but not accumulation
        require(balanceOf(_to) == 0);
        StandardToken.transferFrom(_from, _to, _value);
    }

    // Burn redeemed tokens
    function redeem(address _from, uint256 _value) public only_rewards returns (bool) {
        balances[_from] = balances[_from].sub(_value);
        Transfer(_from, address(0x0), _value);
        return true;
    }

    // Mint new reward tokens
    function reward(address _who, uint256 _value) public only_rewards returns (bool) {
        totalSupply = totalSupply.add(_value);
        balances[_who] = balances[_who].add(_value);
        Transfer(address(0x0), _who, _value);
        return true;
    }

    function setOwner(address _owner) public only_owner {
        owner = _owner;
    }

}