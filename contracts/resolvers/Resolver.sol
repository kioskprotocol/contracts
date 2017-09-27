pragma solidity ^0.4.11;

/** @title Base resolver interface */
interface Resolver {
    function supportsInterface(bytes4 interfaceID) public constant returns (bool);
}