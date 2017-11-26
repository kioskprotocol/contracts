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
    function DINRegistrar(DINRegistry _registry, uint256 _genesis) {
        registry = _registry;

        // Set the current index to the genesis DIN.
        index = _genesis;
    }

    /**
     * @dev Register a new DIN.
     * @return DIN The newly registered DIN.
     */
    function registerDIN() returns (uint256 DIN) {
        index++;
        registry.register(index, msg.sender);
        return index;
    }

    /**
     * @dev Register multiple new DINs.
     * @param quantity The amount of DINs to register.
     */
    function registerDINs(uint256 quantity) {
        for (uint i = 0; i < quantity; i++) {
            registerDIN();
        }
    }

}