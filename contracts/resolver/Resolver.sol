pragma solidity ^0.4.11;

/** @title Base resolver contract */
contract Resolver {
    // https://github.com/ethereum/EIPs/issues/165
    function supportsInterface(bytes4 interfaceID) public constant returns (bool);
}