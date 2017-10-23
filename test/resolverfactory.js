const ResolverFactory = artifacts.require("ResolverFactory.sol");
const StandardResolver = artifacts.require("StandardResolver.sol");
const chai = require("chai"),
    expect = chai.expect;

contract("ResolverFactory", accounts => {
    let factory;
    const alice = accounts[0];
    const productURL = "https://www.google.com/";

    before(async() => {
        factory = await ResolverFactory.deployed();
    });

    it("should create a resolver", async () => {
        const result = await factory.createResolver(productURL, alice);
        expect(result.logs[0].event).to.equal("NewResolver");

        const resolverAddr = result.logs[0].args.resolver;
        const resolver = StandardResolver.at(resolverAddr);

        const url = await resolver.productURL(1000000001);
        expect(url).to.equal(productURL);

        const merchant = await resolver.merchant(1000000001);
        expect(merchant).to.equal(alice);
    });

});