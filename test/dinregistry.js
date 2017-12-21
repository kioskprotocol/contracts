const DINRegistry = artifacts.require("DINRegistry.sol");
const StandardResolver = artifacts.require("StandardResolver.sol");
const Promise = require("bluebird");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();

contract("DINRegistry", accounts => {
    let registry;
    let resolver;
    const DIN = 1000000001;
    const alice = accounts[0];
    const bob = accounts[1];

    before(async () => {
        registry = await DINRegistry.deployed();
        resolver = await StandardResolver.deployed();
    });

    it("should have the correct genesis DIN", async () => {
        const genesis = await registry.genesis();
        expect(genesis.toNumber()).to.equal(1000000000);
    });

    it("should self-register a new DIN", async () => {
        const result = await registry.selfRegisterDIN({ from: alice });
        expect(result.logs[0].event).to.equal("NewRegistration");
    });

    it("should register a new DIN", async () => {
        const result = await registry.registerDIN(bob, { from: alice });
        expect(result.logs[0].event).to.equal("NewRegistration");
    });

    it("should self-register a new DIN with a resolver", async () => {
        const result = await registry.selfRegisterDINWithResolver(
            resolver.address,
            { from: alice }
        );
        expect(result.logs[0].event).to.equal("NewRegistration");
        expect(result.logs[1].event).to.equal("NewResolver");
    });

    it("should register a new DIN with a resolver", async () => {
        const result = await registry.registerDINWithResolver(
            bob,
            resolver.address,
            { from: alice }
        );
        expect(result.logs[0].event).to.equal("NewRegistration");
        expect(result.logs[1].event).to.equal("NewResolver");
    });

    it("should have the correct owner of a DIN", async () => {
        const owner = await registry.owner(DIN);
        expect(owner).to.equal(alice);
    });

    it("should only let the owner of a DIN set the resolver", async () => {
        try {
            const result = await registry.setResolver(
                DIN,
                "0x0000000000000000000000000000000000000000",
                { from: bob }
            );
            expect(result).to.be.null;
        } catch (error) {
            expect(error.message).to.include("VM Exception");
        }

        const result = await registry.setResolver(DIN, resolver.address);
        expect(result.logs[0].event).to.equal("NewResolver");
    });

    it("should have the correct resolver of a DIN", async () => {
        const resolverAddr = await registry.resolver(DIN);
        expect(resolverAddr).to.equal(resolver.address);
    });

    it("should only let the owner transfer ownership of a DIN", async () => {
        try {
            const result = await registry.setOwner(DIN, bob, { from: bob });
            expect(result).to.be.null;
        } catch (error) {
            expect(error.message).to.include("VM Exception");
        }

        const result = await registry.setOwner(DIN, bob, { from: alice });
        expect(result.logs[0].event).to.equal("NewOwner");
        const owner = await registry.owner(DIN);
        expect(owner).to.equal(bob);
    });

    it("should have an updated time for a DIN", async () => {
        const updated = await registry.updated(DIN);
        expect(updated.toNumber()).to.be.above(0);
    });

    it("should change the updated time when a record changes", async () => {
        const updated = await registry.updated(DIN);
        const owner = await registry.owner(DIN);

        const time = 10000

        // Simulate time passing
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time],
            id: 0
        });

        // Alice previously transferred ownership to Bob. Transfer it back here.
        await registry.setOwner(DIN, alice, { from: bob });
        const newUpdated = await registry.updated(DIN);

        expect(newUpdated.toNumber()).to.equal(updated.toNumber() + time + 1);
    });
});