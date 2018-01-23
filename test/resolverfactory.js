const ResolverFactory = artifacts.require("ResolverFactory.sol");
const StandardResolver = artifacts.require("StandardResolver.sol");
const chai = require("chai"),
    expect = chai.expect;

contract("ResolverFactory", accounts => {
    let factory;
    const alice = accounts[0];
    const DIN = 1000000001;
    const baseURL = "https://api.examplestore.com/products/";
    const productURL = "https://api.examplestore.com/products/1000000001";

    before(async() => {
        factory = await ResolverFactory.deployed();
    });

    it("should create a resolver", async () => {
        const result = await factory.createResolver(baseURL);
        expect(result.logs[0].event).to.equal("NewResolver");

        const resolverAddr = result.logs[0].args.resolver;
        const resolver = StandardResolver.at(resolverAddr);

        const tuple = await resolver.productURL(DIN);
        const base = tuple[0];
        const product = tuple[1].toNumber();
        const url = base + product;
        expect(url).to.equal(productURL);
    });
});