const DINRegistryUtils = artifacts.require("DINRegistryUtils.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const StandardResolver = artifacts.require("StandardResolver.sol");
const chai = require("chai"),
    expect = chai.expect
const ABI = require("web3-eth-abi");

contract("DINRegistryUtils", accounts => {
    let utils;
    let registry;
    let resolver;

    let NO_ADDRESS = "0x0000000000000000000000000000000000000000"

    const alice = accounts[0];
    const bob = accounts[1];

    before(async () => {
        utils = await DINRegistryUtils.deployed();
        registry = await DINRegistry.deployed();
        resolver = await StandardResolver.deployed();
    });

    const testOwner = async (minDIN, maxDIN, expectedOwner) => {
        const minOwner = await registry.owner(minDIN);
        const maxOwner = await registry.owner(maxDIN);
        const noOwner = await registry.owner(maxDIN + 1);
        expect(minOwner).to.equal(expectedOwner);
        expect(maxOwner).to.equal(expectedOwner);
        expect(noOwner).to.equal(NO_ADDRESS);
    }

    const testResolver = async (minDIN, maxDIN, expectedResolver) => {
        const minResolver = await registry.resolver(minDIN);
        const maxResolver = await registry.resolver(maxDIN);
        const noResolver = await registry.resolver(maxDIN + 1);
        expect(minResolver).to.equal(expectedResolver);
        expect(maxResolver).to.equal(expectedResolver);
        expect(noResolver).to.equal(NO_ADDRESS);
    }

    it("should self-register multiple DINs", async () => {
        const amount = 10;
        const result = await utils.selfRegisterDINs(amount);
        const logs = result.receipt.logs;
        const topics = logs[0].topics;

        expect(topics[0]).to.equal(web3.sha3("NewRegistration(uint256,address)"));
        expect(logs.length).to.equal(amount);

        const minDIN = parseInt(ABI.decodeParameter("uint256", topics[1]), 10);
        const maxDIN = minDIN + amount - 1;

        await testOwner(minDIN, maxDIN, alice);
    });

    it("should self-register multiple DINs with a resolver", async () => {
        const amount = 10;
        const result = await utils.selfRegisterDINsWithResolver(resolver.address, amount);
        const logs = result.receipt.logs;
        const topics = logs[0].topics;

        const minDIN = parseInt(ABI.decodeParameter("uint256", topics[1]), 10);
        const maxDIN = minDIN + amount - 1;

        await testOwner(minDIN, maxDIN, alice);
        await testResolver(minDIN, maxDIN, resolver.address);
    });

    it("should register multiple DINs", async () => {
        const amount = 10;
        const result = await utils.registerDINs(bob, amount);
        const logs = result.receipt.logs;
        const topics = logs[0].topics;

        expect(topics[0]).to.equal(web3.sha3("NewRegistration(uint256,address)"));
        expect(logs.length).to.equal(amount);

        const minDIN = parseInt(ABI.decodeParameter("uint256", topics[1]), 10);
        const maxDIN = minDIN + amount - 1;

        await testOwner(minDIN, maxDIN, bob);
    });

    it("should register multiple DINs with a resolver", async () => {
        const amount = 10;
        const result = await utils.registerDINsWithResolver(bob, resolver.address, amount);
        const logs = result.receipt.logs;
        const topics = logs[0].topics;

        const minDIN = parseInt(ABI.decodeParameter("uint256", topics[1]), 10);
        const maxDIN = minDIN + amount - 1;

        await testOwner(minDIN, maxDIN, bob);
        await testResolver(minDIN, maxDIN, resolver.address);
    });

});