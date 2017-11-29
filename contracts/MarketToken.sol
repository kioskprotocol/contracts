pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/token/StandardToken.sol";

/** @title Used to pay affiliate rewards. */
contract MarketToken is StandardToken {
    string public name = "Market Token";            // Set the name for display purposes.
    string public symbol = "MARK";                  // Set the symbol for display purposes.
    uint256 public decimals = 18;                   // Amount of decimals for display purposes.
    address public rewards;                         // The address of the Rewards contract.

    modifier only_rewards {
        require(rewards == msg.sender);
        _;
    }
    
    // Constructor
    function MarketToken(address _rewards, uint256 _totalSupply) public { 
        rewards = _rewards;

        // Give the initial balance to the owner.
        balances[msg.sender] = _totalSupply;
        totalSupply = _totalSupply;            
    }

    function transferFromRewards(
        address _from,
        address _to,
        uint256 _value
    )
        public 
        only_rewards
        returns (bool) 
    {
        // Allow the Rewards contract to spend a user's balance.
        balances[_to] = balances[_to].add(_value);
        balances[_from] = balances[_from].sub(_value);
        Transfer(_from, _to, _value);
        return true;
    }

}