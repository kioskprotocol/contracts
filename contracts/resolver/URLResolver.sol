pragma solidity ^0.4.11;

import "./Resolver.sol";

/** @title Resolver contract that specifies an API endpoint where product information can be retrieved */
contract URLResolver is Resolver {
    function productURL(uint256 DIN) public constant returns (string baseURL, uint256 productId);
}