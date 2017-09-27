pragma solidity ^0.4.11;

/** @title Resolver contract that specifies an API endpoint where product information can be retrieved */
contract URLResolver is Resolver {
    string public productURL;
}