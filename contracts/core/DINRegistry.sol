pragma solidity ^0.4.11;

/** @title Decentralized Identification Number (DIN) registry. */
contract DINRegistry {

    struct Record {
        address owner;
        address resolver;  // Address where product information is stored. 
        uint256 updated;   // Unix timestamp.
    }

    // DIN => Record
    mapping (uint256 => Record) records;

    // The first DIN registered.
    uint256 public genesis;

    // The current DIN.
    uint256 public index;

    modifier only_owner(uint256 DIN) {
        require(records[DIN].owner == msg.sender);
        _;
    }

    // Logged when the owner of a DIN transfers ownership to a new account.
    event NewOwner(uint256 indexed DIN, address indexed owner);

    // Logged when the resolver associated with a DIN changes.
    event NewResolver(uint256 indexed DIN, address indexed resolver);

    // Logged when a new DIN is registered.
    event NewRegistration(uint256 indexed DIN, address indexed owner);

    /** @dev Constructor.
      * @param _genesis The first DIN registered.
      */
    function DINRegistry(uint256 _genesis) public {
        genesis = _genesis;
        index = _genesis;

        // Register the genesis DIN to the account that deploys this contract.
        records[_genesis].owner = msg.sender;
        records[_genesis].updated = block.timestamp;
        NewRegistration(_genesis, msg.sender);
    }

    // Get the owner of a specified DIN.
    function owner(uint256 _DIN) public constant returns (address) {
        return records[_DIN].owner;
    }

    /**
     * @dev Transfer ownership of a DIN.
     * @param _DIN The DIN to transfer.
     * @param _owner The address of the new owner.
     */
    function setOwner(uint256 _DIN, address _owner) public only_owner(_DIN) {
        records[_DIN].owner = _owner;
        records[_DIN].updated = block.timestamp;
        NewOwner(_DIN, _owner);
    }

    // Get the resolver of a specified DIN.
    function resolver(uint256 _DIN) public constant returns (address) {
        return records[_DIN].resolver;
    }

    /**
     * @dev Set the resolver of a DIN.
     * @param _DIN The DIN to update.
     * @param _resolver The address of the resolver.
     */
    function setResolver(uint256 _DIN, address _resolver) public only_owner(_DIN) {
        records[_DIN].resolver = _resolver;
        records[_DIN].updated = block.timestamp;
        NewResolver(_DIN, _resolver);
    }

    // Get the time a specified DIN record was last updated.
    function updated(uint256 _DIN) public constant returns (uint256) {
        return records[_DIN].updated;
    }

    function selfRegisterDIN() public returns (uint256 DIN) {
        index++;
        records[index].owner = msg.sender;
        records[index].updated = block.timestamp;
        NewRegistration(index, msg.sender);
        return index;
    }

    function selfRegisterDINs(uint256 _amount) public returns (uint256 minDIN, uint256 maxDIN) {
        uint256 startIndex = index + 1;
        for (uint i = 0; i < _amount; i++) {
            selfRegisterDIN();
        }
        return (startIndex, index);
    }

    function selfRegisterDINWithResolver(address _resolver) public returns (uint256 DIN) {
        index++;
        records[index].owner = msg.sender;
        records[index].resolver = _resolver;
        records[index].updated = block.timestamp;
        NewRegistration(index, msg.sender);
        NewResolver(index, _resolver);
        return index;
    }

    function selfRegisterDINsWithResolver(address _resolver, uint256 _amount) 
        public 
        returns (uint256 minDIN, uint256 maxDIN) 
    {
        uint256 startIndex = index + 1;
        for (uint i = 0; i < _amount; i++) {
            selfRegisterDINWithResolver(_resolver);
        }
        return (startIndex, index);
    }

    /**
     * @dev Register a new DIN.
     * @param _owner The account that will own the DIN.
     */
    function registerDIN(address _owner) public returns (uint256 DIN) {
        index++;
        records[index].owner = _owner;
        records[index].updated = block.timestamp;
        NewRegistration(index, _owner);
        return index;
    }

    function registerDINs(address _owner, uint256 _amount) 
        public 
        returns (uint256 minDIN, uint256 maxDIN) 
    {
        uint256 startIndex = index + 1;
        for (uint i = 0; i < _amount; i++) {
            registerDIN(_owner);
        }
        return (startIndex, index);
    }

    /**
     * @dev Register a new DIN and set the resolver.
     * @param _owner The account that will own the DIN.
     * @param _resolver The address of the resolver.
     */
    function registerDINWithResolver(address _owner, address _resolver) public returns (uint256 DIN) {
        index++;
        records[index].owner = _owner;
        records[index].resolver = _resolver;
        records[index].updated = block.timestamp;
        NewRegistration(index, _owner);
        NewResolver(index, _resolver);
        return index;
    }

    function registerDINsWithResolver(address _owner, address _resolver, uint256 _amount) 
        public 
        returns (uint256 minDIN, uint256 maxDIN)
    {
        uint256 startIndex = index + 1;
        for (uint i = 0; i < _amount; i++) {
            registerDINWithResolver(_owner, _resolver);
        }
        return (startIndex, index);
    }

}