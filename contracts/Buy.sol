pragma solidity ^0.4.11;

import "./MarketToken.sol";
import "./DINRegistry.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract Buy {
    MarketToken public marketToken;
    DINRegistry public registry;

    // The current order ID.
    uint256 public orderIndex = 0;

    enum Errors {
        INSUFFICIENT_BALANCE,
        INVALID_PRICE,
        INVALID_SIGNATURE
    }

    // Logs Solidity errors
    event LogError(uint8 indexed errorId);

    // Logs new orders
    event NewOrder(
        uint256 orderID,
        address indexed buyer,
        address indexed seller,
        uint256 indexed DIN,
        uint256 quantity,
        uint256 value,
        uint256 timestamp
    );

    /** @dev Constructor.
      * @param _token The Market Token contract address.
      * @param _registry The DIN Registry contract address.
      */
    function Buy(MarketToken _token, DINRegistry _registry) {
        marketToken = _token;
        registry = _registry;
    }

    /** @dev Buy a product.
      * @param DIN The Decentralized Identification Number (DIN) of the product to buy.
      * @param quantity The quantity to buy.
      * @param totalValue Total price of the purchase, denominated in Market Token base units.
      * @param v ECDSA signature parameter v.
      * @param r ECDSA signature parameter r.
      * @param s ECDSA signature parameter s.
      * @return orderID A unique ID for the order.
      */
    function buy(
        uint256 DIN,
        uint256 quantity,
        uint256 totalValue,
        uint256 priceValidUntil,  // Unix timestamp.
        uint8 v,
        bytes32 r,
        bytes32 s
    )
        public
        returns (uint256 orderID)
    {
        if (totalValue > marketToken.balanceOf(msg.sender)) {
            LogError(uint8(Errors.INSUFFICIENT_BALANCE));
            return 0;
        } else if (block.timestamp > priceValidUntil || totalValue == 0) {
            LogError(uint8(Errors.INVALID_PRICE));
            return 0;
        }

        uint256 unitPrice = totalValue / quantity;

        // Calculate the hash of the parameters provided by the buyer.
        bytes32 hash = keccak256(DIN, unitPrice, priceValidUntil);

        // Get the seller address from the DIN Registry.
        address seller = registry.owner(DIN);

        // Verify that the seller has signed the parameters provided by the buyer.
        bool isValid = isValidSignature(seller, hash, v, r, s);

        if (isValid == false) {
            LogError(uint8(Errors.INVALID_SIGNATURE));
            return 0;
        }

        // Increment the order index.
        orderIndex++;

        // Transfer Market Tokens (MARKs) from buyer to seller.
        marketToken.transferFromBuy(msg.sender, seller, totalValue);

        NewOrder(
            orderIndex,     // Order ID
            msg.sender,     // Buyer
            seller,
            DIN,
            quantity,
            totalValue,
            block.timestamp
        );
    }

    /**
      * @dev Verifies that an order signature is valid.
      * @param signer address of signer.
      * @param hash Signed Keccak-256 hash.
      * @param v ECDSA signature parameter v.
      * @param r ECDSA signature parameters r.
      * @param s ECDSA signature parameters s.
      * @return Validity of order signature.
      */
    function isValidSignature(
        address signer,
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
        public
        constant
        returns (bool)
    {
        return signer == ecrecover(
            keccak256("\x19Ethereum Signed Message:\n32", hash),
            v,
            r,
            s
        );
    }

}