pragma solidity ^0.4.11;

/** @title Universal shopping cart */
contract Cart {
    event AddToCart(uint256 indexed DIN, address indexed buyer);

    function addToCart(uint256 DIN) public {
        AddToCart(DIN, msg.sender);
    }
}
