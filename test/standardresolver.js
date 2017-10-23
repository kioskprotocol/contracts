const StandardResolver = artifacts.require("StandardResolver.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const chai = require("chai"),
    expect = chai.expect;

contract("StandardResolver", accounts => {
    let resolver;
    let registry;
    const alice = accounts[0]; // DIN owner
    const bob = accounts[1]; // Merchant
    const carol = accoutns[2]; // Unauthorized user
    const productURL = "https://www.google.com/";

    const DIN = 1000000001;

    before(async () => {
        resolver = await StandardResolver.deployed();
        registry = await DINRegistry.deployed();

        // Alice will own DIN 10000000001.
        await DINRegistry.registerDIN({ from: alice });
    });

    it("should have the correct owner", async () => {
        const owner = await resolver.owner();
        expect(owner).to.equal(alice);
    });

    it("should have the correct product URL", async () => {
        const url = await resolver.productURL(DIN);
        expect(url).to.equal(productURL);
    });

    it("should have the correct merchant", async () => {
        const merchant = await resolver.merchant(DIN);
        expect(merchant).to.equal(bob);
    });

    it("should let the DIN owner update product URL, merchant, and owner", async () => {
        await resolver.setMerchant(1000000001, "https://www.shopify.com/");
    });

    it("should throw if an unauthorized user tries to set product URL, merchant, or owner", async () => {
        //
    });

});