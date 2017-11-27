pragma solidity ^0.4.11;

contract Orders {
    // The next order ID.
    uint256 public orderIndex = 0;

    // Logs new orders
    event NewOrder(
        uint256 indexed orderID,
        bytes32 nonceHash,
        address checkout,
        address indexed buyer,
        address indexed merchant,
        uint256 DIN,
        uint256 quantity,
        uint256 totalPrice,
        uint256 timestamp
    );

    function createOrder(
        bytes32 nonceHash,
        address buyer,
        address merchant,
        uint256 DIN,
        uint256 quantity,
        uint256 totalPrice
    )
        public
        returns (uint256 orderID)
    {
        // Increment the order index.
        orderIndex++;

        NewOrder(
            orderIndex,
            nonceHash,
            msg.sender,
            buyer,
            merchant,
            DIN,
            quantity,
            totalPrice,
            block.timestamp
        );

        return orderIndex;
    }
}