pragma solidity ^0.4.11;

contract Orders {
    // The next order ID.
    uint256 public orderIndex = 0;

    // Log new orders
    event NewOrder(
        uint256 indexed orderID,
        address checkout,
        bytes32 nonceHash,
        uint256[] DINs,
        uint256[] quantities
    );

    function createOrder(
        bytes32 nonceHash,
        uint256[] DINs,
        uint256[] quantities
    ) 
        public 
        returns (uint256 orderID) 
    {
        require(DINs.length == quantities.length);
        
        // Increment the order index.
        orderIndex++;

        NewOrder(
            orderIndex,
            msg.sender,
            nonceHash,
            DINs,
            quantities
        );
        
        return orderIndex;
    }
}