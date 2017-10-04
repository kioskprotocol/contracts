pragma solidity ^0.4.11;

/** @title Base resolver contract */
contract Resolver {
    function supportsInterface(bytes4 interfaceID) public constant returns (bool);
}