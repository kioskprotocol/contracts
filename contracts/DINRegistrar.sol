pragma solidity ^0.4.11;

import "./DINRegistry.sol";

/** @title Decentralized Identification Number (DIN) registrar. Registers new DINs */
contract DINRegistrar {

    // The DINRegistry contract
    DINRegistry registry;

    // The current DIN index. DINs are registered sequentially.
    uint256 public index;

    /** @dev Constructor.
      * @param _registry The DINRegistry contract.
      */
    function DINRegistrar(DINRegistry _registry, uint256 _genesis) public {
        registry = _registry;

        // Set the current index to the genesis DIN.
        index = _genesis;
    }

    /**
     * @dev Register a new DIN.
     * @return DIN The newly registered DIN.
     */
    function registerDIN() public returns (uint256 DIN) {
        index++;
        registry.register(index, msg.sender);
        return index;
    }

    /**
     * @dev Register multiple new DINs.
     * @param quantity The amount of DINs to register.
     */
    function registerDINs(uint256 quantity) public {
        for (uint i = 0; i < quantity; i++) {
            registerDIN();
        }
    }

    /**
     * @dev Register a new DIN to a different account.
     * @param owner The account that will own the new DIN.
     * @return DIN The newly registered DIN.
     */
    function registerDINFor(address owner) public returns (uint256 DIN) {
        index++;
        registry.register(index, owner);
        return index;
    }

    /**
     * @dev Register multiple new DINs to a different account.
     * @param owner The account that will own the new DINs.
     * @param quantity The amount of DINs to register.
     */
    function registerDINsFor(address owner, uint256 quantity) public {
        for (uint i = 0; i < quantity; i++) {
            registerDINFor(owner);
        }
    }

    /**
     * @dev Register a new DIN and set its resolver.
     * @param owner The account that will own the new DIN.
     * @param resolver The address of the resolver.
     * @return DIN The newly registered DIN.
     */
    function registerDINWithResolver(address owner, address resolver) public returns (uint256 DIN) {
        index++;
        registry.registerWithResolver(index, owner, resolver);
        return index;
    }

    /**
     * @dev Register multiple new DINs and set their resolvers.
     * @param owner The account that will own the new DINs.
     * @param resolver The address of the resolver.
     * @param quantity The amount of DINs to register.
     */
    function registerDINsWithResolver(address owner, address resolver, uint256 quantity) public {
      for (uint i = 0; i < quantity; i++) {
            registerDINWithResolver(owner, resolver);
        }
    }

}