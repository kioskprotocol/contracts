pragma solidity ^0.4.11;

import "./StandardResolver.sol";

/** @title Resolver factory. Creates new resolver contracts */
contract ResolverFactory {

    // Logged when a new resolver contract is created.
    event NewResolver(
        address indexed resolver, 
        address indexed owner,
        string productURL 
    );

    function createResolver(string productURL) public {
        StandardResolver resolver = new StandardResolver(msg.sender, productURL);
        NewResolver(resolver, msg.sender, productURL);
    }

}