const DINRegistrar = artifacts.require("DINRegistrar.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const Promise = require("bluebird");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();

contract("DINRegistrar", accounts => {
    let registrar;
    let registry;
    const genesis = 1000000000;
    const registryDeployer = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];
    const newAddress = "0x1111111111111111111111111111111111111111";

    before(async () => {
        registrar = await DINRegistrar.deployed();
        registry = await DINRegistry.deployed();

        await registrar.registerDIN({ from: alice });
    });

    /**  ==================================
      *              Resolver
      *  ==================================
      */

    it("should throw if an unauthorized account tries to set the resolver of a DIN", async () => {
        try {
            await registry.setResolver(1000000001, newAddress, { from: bob });
        } catch (error) {
            assert.include(
                error.message,
                "invalid opcode",
                "Trying to change the resolver of a DIN you don't own should throw an error."
            );
        }
    });

    it("should let an owner set the resolver for a DIN", async () => {
        const resolver = await registry.resolver(1000000001);
        expect(resolver).to.equal("0x0000000000000000000000000000000000000000");

        const result = await registry.setResolver(1000000001, newAddress, { from: alice });
        // Test for NewResolver event
        expect(result.logs[0].event).to.equal("NewResolver");

        const newResolver = await registry.resolver(1000000001);
        expect(newResolver).to.equal(newAddress);
    });

    /**  ==================================
      *               Owner
      *  ==================================
      */

    it("should have the correct owner of a DIN", async () => {
        const genesisOwner = await registry.owner(genesis);
        expect(genesisOwner).to.equal(registryDeployer);

        const firstDINOwner = await registry.owner(1000000001);
        expect(firstDINOwner).to.equal(alice);
    });

    it("should throw if an unauthorized account tries to transfer ownership of a DIN", async () => {
        try {
            await registry.setOwner(1000000001, newAddress, { from: bob });
        } catch (error) {
            assert.include(
                error.message,
                "invalid opcode",
                "Trying to change the owner of a DIN you don't own should throw an error."
            );
        }
    });

    it("should let an owner transfer ownership of a DIN", async () => {
        const owner = await registry.owner(1000000001);
        expect(owner).to.equal(alice);

        const result = await registry.setOwner(1000000001, bob, { from: alice });
        // Test for NewOwner event
        expect(result.logs[0].event).to.equal("NewOwner");

        const newOwner = await registry.owner(1000000001);
        expect(newOwner).to.equal(bob);
    });

    /**  ==================================
      *             Registrar
      *  ==================================
      */

    it("should have the correct registrar", async () => {
        const registrarContract = await registry.registrar();
        expect(registrarContract).to.equal(registrar.address);
    });

    it("should throw if an unauthorized account tries to set the registrar", async () => {
        try {
            await registry.setRegistrar(newAddress, { from: bob });
        } catch (error) {
            assert.include(
                error.message,
                "invalid opcode",
                "Trying to change registrar without owning the genesis DIN should throw an error."
            );
        }
    });

    it("should let the genesis owner set the registrar", async () => {
        const result = await registry.setRegistrar(newAddress, { from: registryDeployer });
        // Test for NewRegistrar event
        expect(result.logs[0].event).to.equal("NewRegistrar");

        const newRegistrar = await registry.registrar();
        expect(newRegistrar).to.equal(newAddress);
    });

    /**  ==================================
      *              Updated
      *  ==================================
      */

    it("should have an updated time for a DIN", async () => {
        const updated = await registry.updated(1000000001);
        expect(updated.toNumber()).to.be.above(0);
    });

    it("should change the updated time when a record changes", async () => {
        const updated = await registry.updated(1000000001);
        const owner = await registry.owner(1000000001);

        // Simulate time passing
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [10000],
            id: 0
        });

        // Alice previously transferred ownership to Bob. Transfer it back here.
        await registry.setOwner(1000000001, alice, { from: bob });
        const firstUpdate = await registry.updated(1000000001);
        expect(firstUpdate.toNumber()).to.be.above(updated.toNumber());

        // Simulate time passing
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [10000],
            id: 0
        });

        await registry.setResolver(1000000001, newAddress, { from: alice });
        const secondUpdate = await registry.updated(1000000001);
        expect(secondUpdate.toNumber()).to.be.above(firstUpdate.toNumber());
    });

});