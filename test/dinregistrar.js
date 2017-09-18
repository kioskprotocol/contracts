const DINRegistrar = artifacts.require("DINRegistrar.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const Promise = require("bluebird");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();

contract("DINRegistrar", accounts => {
    let registrar;
    let registry;
    const alice = accounts[1];

    before(async () => {
        registrar = await DINRegistrar.deployed();
        registry = await DINRegistry.deployed();
    });

    const getDINFromLog = async () => {
        const registrationEvent = registry.NewRegistration({ owner: alice });
        const eventAsync = Promise.promisifyAll(registrationEvent);
        const logs = await eventAsync.getAsync();

        const DIN = parseInt(logs[0]["args"]["DIN"]);
        return DIN;
    };

    it("should register a new DIN", async () => {
        await registrar.registerDIN({ from: alice });

        // Get the DIN from the event log.
        const DIN = await getDINFromLog();
        expect(DIN).to.equal(1000000001);

        // Alice should own the newly registered DIN.
        const owner = await registry.owner(DIN);
        expect(owner).to.equal(alice);

        // It should increment the current index.
        const index = await registrar.index();
        expect(index.toNumber()).to.equal(DIN);
    });

    it("should register multiple DINs", async () => {
        await registrar.registerDINs(10, { from: alice });

        // Alice should own the newly registered DINs.
        const firstOwner = await registry.owner(1000000002);
        expect(firstOwner).to.equal(alice);

        const secondOwner = await registry.owner(1000000003);
        expect(firstOwner).to.equal(alice);

        const lastOwner = await registry.owner(1000000011);
        expect(lastOwner).to.equal(alice);

        // Expect an unregistered DIN to not be owned.
        const unowned = await registry.owner(1000000012);
        expect(unowned).to.equal("0x0000000000000000000000000000000000000000");

        // It should advance the current index to the last owned DIN.
        const index = await registrar.index();
        expect(index.toNumber()).to.equal(1000000011);
    });

    it("should not allow registering more than 10 DINs at once", async () => {
        try {
            await registrar.registerDINs(11, { from: alice });
        } catch (error) {
            assert.include(
                error.message,
                "invalid opcode",
                "Registering more than 10 DINs should throw an error."
            );
        }
    });
});