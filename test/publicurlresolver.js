const PublicURLResolver = artifacts.require("PublicURLResolver.sol");

contract("PublicURLResolver", accounts => {
    let resolver;

    before(async () => {
        resolver = await PublicURLResolver.deployed();
    });

    
});