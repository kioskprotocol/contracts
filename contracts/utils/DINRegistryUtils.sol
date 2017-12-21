pragma solidity ^0.4.11;

import "../core/DINRegistry.sol";

/** @title Convenience methods for DINRegistry */
contract DINRegistryUtils {

    DINRegistry registry;

    // Constructor
    function DINRegistryUtils(DINRegistry _registry) public {
        registry = _registry;
    }

    /**
     * @dev Self-register multiple new DINs.
     * @param amount The amount of DINs to register.
     */
    function selfRegisterDINs(uint256 amount) public {
        registerDINs(msg.sender, amount);
    }

    /**
     * @dev Self-register multiple new DINs and set the resolver.
     * @param resolver The address of the resolver.
     * @param amount The amount of DINs to register.
     */
    function selfRegisterDINsWithResolver(address resolver, uint256 amount) public {
        registerDINsWithResolver(msg.sender, resolver, amount);
    }

    /**
     * @dev Register multiple new DINs.
     * @param owner The account that will own the DINs.
     * @param amount The amount of DINs to register.
     */
    function registerDINs(address owner, uint256 amount) public {
        for (uint i = 0; i < amount; i++) {
            registry.registerDIN(owner);
        }
    }

    /**
     * @dev Register multiple new DINs and set the resolver.
     * @param owner The account that will own the DINs.
     * @param resolver The address of the resolver.
     * @param amount The amount of DINs to register.
     */
    function registerDINsWithResolver(address owner, address resolver, uint256 amount) public {
        for (uint i = 0; i < amount; i++) {
            registry.registerDINWithResolver(owner, resolver);
        }
    }

}