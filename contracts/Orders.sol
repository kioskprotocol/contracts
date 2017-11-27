pragma solidity ^0.4.11;

contract Orders {
    // The next order ID.
    uint256 public orderIndex = 0;

    // Logs new orders
    event NewOrder(
        uint256 indexed orderID,
        bytes32 nonceHash,
        address indexed merchant,
        uint256 indexed DIN,
        uint256 quantity,
        uint256 totalPrice,
        uint256 timestamp
    );

    function createOrder(
        bytes32 nonceHash,
        address merchant,
        uint256 DIN,
        uint256 quantity,
        uint256 totalPrice
    )
        public
        // TODO: Only checkout
        returns (uint256 orderID)
    {
        // Increment the order index.
        orderIndex++;

        NewOrder(
            orderIndex,
            nonceHash,
            merchant,
            DIN,
            quantity,
            totalPrice,
            block.timestamp
        );

        return orderIndex;
    }
}