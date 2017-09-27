pragma solidity ^0.4.11;

import "./URLResolver.sol";
import "../DINRegistry.sol";

/** @title Resolver contract that specifies an API endpoint where product information can be retrieved */
contract PublicURLResolver is URLResolver {
    bytes4 constant INTERFACE_META_ID = 0x01ffc9a7;      // bytes4(sha3("supportsInterface(bytes4)"))
    bytes4 constant BASE_URL_INTERFACE_ID = 0x35460fb2;  // bytes4(sha3("baseURL(uint256)"))

    // DIN => Base URL
    mapping (uint256 => string) urls;

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
               interfaceID == BASE_URL_INTERFACE_ID;
    }

    function baseURL(uint256 DIN) public constant returns (string) {
        return urls[DIN];
    }

    function setBaseURL(uint256 DIN, string url) public only_owner(DIN) {
        urls[DIN] = url;
    }

}