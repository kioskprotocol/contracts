pragma solidity ^0.4.11;

/** @title Universal shopping cart */
// TODO: A decentralized application should be able to add items on behalf of the buyer.
contract Cart {
    event AddToCart(uint256 indexed DIN, address indexed buyer);
    event RemoveFromCart(uint256 indexed DIN, address indexed buyer);
    event EmptyCart(address indexed buyer);

    function addToCart(uint256 DIN) {
        AddToCart(DIN, msg.sender);
    }

    function removeFromCart(uint256 DIN) {
        RemoveFromCart(DIN, msg.sender);
    }

    function emptyCart() {
        EmptyCart(msg.sender);
    }
}