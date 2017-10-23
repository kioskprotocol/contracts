pragma solidity ^0.4.11;

import "./MarketToken.sol";
import "./DINRegistry.sol";
import "./Resolver.sol";

contract Checkout {
    MarketToken public marketToken;
    DINRegistry public registry;

    // The next order ID.
    uint256 public orderIndex = 0;

    // Prevents Solidity "stack too deep" error.
    struct Order {
        uint256 DIN;
        uint256 quantity;
        uint256 totalPrice;
        address priceCurrency;
        uint256 priceValidUntil;
        uint256 affiliateFee;
        address affiliate;
    }

    // Logs Solidity errors
    event LogError(string error);

    // Logs new orders
    event NewOrder(
        uint256 indexed orderID,
        address indexed buyer,
        address indexed merchant,
        uint256 DIN,
        uint256 quantity,
        uint256 totalPrice,
        address priceCurrency,
        uint256 timestamp
    );

    /** @dev Constructor.
      * @param _token The Market Token contract address.
      * @param _registry The DIN Registry contract address.
      */
    function Checkout(MarketToken _token, DINRegistry _registry) {
        marketToken = _token;
        registry = _registry;
    }

    /** @dev Buy a product.
      * param orderValues:
        [0] DIN The Decentralized Identification Number (DIN) of the product to buy.
        [1] quantity The quantity to buy.
        [2] totalPrice Total price of the purchase, denominated in base units of the price currency.
        [3] priceValidUntil Expiration time (Unix timestamp).
        [4] affiliateFee Affiliate reward (optional), denominated in base units of Market Token (MARK).
      * param orderAddresses:
        [0] priceCurrency Address of the token used for pricing. Ether (ETH) is represented by the null address (0x0...).
        [1] affiliate Address of the affiliate.  
      * @param v ECDSA signature parameter v.
      * @param r ECDSA signature parameter r.
      * @param s ECDSA signature parameter s.
      * @return orderID A unique ID for the order.
      */
    function buy(
        uint256[5] orderValues,
        address[2] orderAddresses,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
        payable
        public
        returns (uint256 orderID)
    {
        Order memory order = Order({
            DIN: orderValues[0],
            quantity: orderValues[1],
            totalPrice: orderValues[2],
            priceCurrency: orderAddresses[0],
            priceValidUntil: orderValues[3],
            affiliateFee: orderValues[4],
            affiliate: orderAddresses[1]
        });

        if (block.timestamp > order.priceValidUntil) {
            LogError("Offer expired");
            return 0;
        }

        if (order.totalPrice == 0) {
            LogError("Invalid price");
            return 0;
        }

        uint256 unitPrice = order.totalPrice / order.quantity;

        // Calculate the hash of the parameters provided by the buyer.
        bytes32 hash = keccak256(order.DIN, unitPrice, order.priceCurrency, order.priceValidUntil, order.affiliateFee);

        // Get the resolver address from the DIN Registry.
        address resolverAddr = registry.resolver(order.DIN);

        if (resolverAddr == address(0x0)) {
            LogError("Invalid resolver");
            return 0;
        }

        // TODO: DANGER ZONE. OUTSIDE CALL.
        address merchant = Resolver(resolverAddr).merchant(order.DIN);

        if (merchant == address(0x0)) {
            LogError("Invalid merchant");
            return 0;
        }

        // Get the owner address from the DIN registry.
        address owner = registry.owner(order.DIN);

        // Verify that the DIN owner has signed the parameters provided by the buyer.
        bool isValid = isValidSignature(owner, hash, v, r, s);

        if (isValid == false) {
            LogError("Invalid signature");
            return 0;
        }

        // Transaction is valid. Transfer tokens from buyer to merchant.
        bool success;

        if (order.priceCurrency == address(marketToken)) {
            success = transferMarketTokens(msg.sender, merchant, order.totalPrice);
        } else if (order.priceCurrency == address(0x0)) {
            success = transferEther(msg.sender, merchant, order.totalPrice);
        } else {
            success = transferERC20(msg.sender, merchant, order.totalPrice, order.priceCurrency);
        }

        if (success == true) {
            if (order.affiliate == msg.sender) {
                LogError("Invalid affiliate");
                return 0;
            }

            if (order.affiliateFee > 0) {
                // Transfer affiliate fee from DIN owner to affiliate.
                marketToken.transferFromCheckout(owner, order.affiliate, order.affiliateFee);
            }

            // Increment the order index.
            orderIndex++;

            NewOrder(
                orderIndex,     // Order ID
                msg.sender,     // Buyer
                merchant,
                order.DIN,
                order.quantity,
                order.totalPrice,
                order.priceCurrency,
                block.timestamp
            );

            return orderIndex;
        } else {
            LogError("Transferring tokens failed");
            return 0;
        }
    }

    function transferMarketTokens(
        address buyer,
        address merchant,
        uint256 totalPrice
    ) 
        private
        returns (bool success)
    {
        // Transfer Market Tokens (MARK) from buyer to merchant.
        return marketToken.transferFromCheckout(buyer, merchant, totalPrice);
    }

    function transferEther(
        address buyer,
        address merchant,
        uint256 totalPrice
    ) 
        private
        returns (bool success) 
    {
        // Transfer Ether (ETH) from buyer to merchant.
        if (msg.value == totalPrice) {
            merchant.transfer(msg.value);
            return true;
        } else {
            // Return Ether to buyer and log error.
            buyer.transfer(msg.value);
            LogError("Invalid price");
            return false;
        }
    }

    function transferERC20(
        address buyer, 
        address merchant, 
        uint256 totalPrice, 
        address token
    )
        private
        returns (bool success)
    {
        LogError("Coming soon!");
        return false;
    }

    /**
      * @dev Verifies that an order signature is valid.
      * @param signer address of signer.
      * @param hash Signed Keccak-256 hash.
      * @param v ECDSA signature parameter v.
      * @param r ECDSA signature parameters r.
      * @param s ECDSA signature parameters s.
      * @return valid Validity of order signature.
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