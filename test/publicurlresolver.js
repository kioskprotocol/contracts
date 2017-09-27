const PublicURLResolver = artifacts.require("PublicURLResolver.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();

contract("PublicURLResolver", accounts => {
    let resolver;
    let registrar;
    let registry;
    const alice = accounts[1];
    const bob = accounts[2];
    const productURL = "https://www.google.com/";
    const DIN = 1000000001;

    before(async () => {
        registrar = await DINRegistrar.deployed();
        registry = await DINRegistry.deployed();
        resolver = await PublicURLResolver.deployed();

        await registrar.registerDIN({ from: alice });
    });

    it("should support the correct interfaces", async () => {
        const interfaceMetaId = web3.sha3("supportsInterface(bytes4)").slice(0, 10);
        const productURLInterfaceId = web3.sha3("productURL(uint256)").slice(0, 10);
        const randomInterfaceId = web3.sha3("random(uint256)").slice(0, 10);

        console.log(productURLInterfaceId)

        const interfaceMetaBool = await resolver.supportsInterface(interfaceMetaId);
        const productURLInterfaceBool = await resolver.supportsInterface(productURLInterfaceId);
        const randomInterfaceBool = await resolver.supportsInterface(randomInterfaceId);

        expect(interfaceMetaBool).to.equal(true);
        expect(productURLInterfaceBool).to.equal(true);
        expect(randomInterfaceBool).to.equal(false);
    });

    it("should let a DIN owner set its product URL", async () => {
        const owner = await registry.owner(DIN);
        expect(owner).to.equal(alice);

        const url = await resolver.productURL(DIN);
        expect(url).to.equal("");

        await resolver.setProductURL(DIN, productURL, { from: alice });

        const newUrl = await resolver.productURL(DIN);
        expect(newUrl).to.equal(productURL);
    });

    it("should throw if an unauthorized account tries to set the product URL for a DIN", async () => {
        try {
            await resolver.setProductURL(DIN, productURL, { from: bob });
        } catch (error) {
            assert.include(
                error.message,
                "invalid opcode",
                "Trying to set the product URL of a DIN you don't own should throw an error."
            );
        }
    });
});