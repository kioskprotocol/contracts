pragma solidity ^0.4.11;

import "./DINRegistry.sol";
import "./StandardResolver.sol";

/** @title Resolver factory. Creates new resolver contracts */
contract ResolverFactory {

    DINRegistry public registry;

    // Logged when a new resolver contract is created.
    event NewResolver(
        address indexed resolver, 
        address indexed owner,
        string productURL, 
        address indexed merchant
    );

    function ResolverFactory(DINRegistry _registry) public {
        registry = _registry;
    }

    function createResolver(string productURL, address merchant) public {
        StandardResolver resolver = new StandardResolver(registry, msg.sender, productURL, merchant);
        NewResolver(resolver, msg.sender, productURL, merchant);
    }

}