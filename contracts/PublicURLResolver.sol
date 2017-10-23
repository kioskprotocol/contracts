pragma solidity ^0.4.11;

import "./URLResolver.sol";
import "./DINRegistry.sol";

/** @title Resolver contract that specifies an API endpoint where product information can be retrieved */
contract PublicURLResolver is URLResolver {
    bytes4 constant INTERFACE_META_ID = 0x01ffc9a7;         // bytes4(keccak256("supportsInterface(bytes4)"))
    bytes4 constant PRODUCT_URL_INTERFACE_ID = 0xaf655719;  // bytes4(keccak256("productURL(uint256)"))
    bytes4 constant MERCHANT_INTERFACE_ID = 0x90a9f8b8;     // bytes4(keccak256("merchant(uint256)"))

    // DIN => Product URL
    mapping (uint256 => string) productURLs;
    mapping (uint256 => address) merchants;

    DINRegistry registry;

    modifier only_owner(uint256 DIN) {
        require(registry.owner(DIN) == msg.sender);
        _;
    }

    /** @dev Constructor.
      * @param _registry The DIN registry.
      */
    function PublicURLResolver(DINRegistry _registry) public {
        registry = _registry;
    }

    function supportsInterface(bytes4 interfaceID) public constant returns (bool) {
        return interfaceID == INTERFACE_META_ID ||
               interfaceID == PRODUCT_URL_INTERFACE_ID ||
               interfaceID == MERCHANT_INTERFACE_ID;
    }

    function productURL(uint256 DIN) public constant returns (string) {
        return productURLs[DIN];
    }

    function setProductURL(uint256 DIN, string URL) public only_owner(DIN) {
        productURLs[DIN] = URL;
    }

    function merchant(uint256 DIN) public constant returns (address) {
        return merchants[DIN];
    }

    function setMerchant(uint256 DIN, address merchant) public only_owner(DIN) {
        merchants[DIN] = merchant;
    }

}