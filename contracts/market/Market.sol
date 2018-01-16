pragma solidity ^0.4.17;

import "../core/DINRegistry.sol";
import "../core/Orders.sol";

/** @title A market generates orders from DINs. */
contract Market {
    DINRegistry public registry;
    Orders public orders;

    // Log Solidity errors
    event LogError(string error);

    /**
      * @dev Verify that an order signature is valid.
      * @param signer address of signer.
      * @param hash Signed Keccak-256 hash.
      * @param v ECDSA signature parameter v.
      * @param r ECDSA signature parameters r.
      * @param s ECDSA signature parameters s.
      * @return valid Validity of the order signature.
      */
    // Attribution: 0x - https://github.com/0xProject/contracts/blob/master/contracts/Exchange.sol#L447
    function isValidSignature(
        address signer,
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
        public
        pure
        returns (bool valid)
    {
        return signer == ecrecover(
            keccak256("\x19Ethereum Signed Message:\n32", hash),
            v,
            r,
            s
        );
    }

}