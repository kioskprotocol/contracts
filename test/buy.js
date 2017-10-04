const Buy = artifacts.require("Buy.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const MarketToken = artifacts.require("MarketToken.sol");
const Promise = require("bluebird");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();
const utils = require('web3-utils');

contract("Buy", accounts => {
    let buy;
    let registry;
    let registrar;
    let token;
    const alice = accounts[0];
    const bob = accounts[1];

    // Product details
    let DIN;
    const quantity = 1;
    const price = 5 * Math.pow(10, 18); // The price of Bob's product is 5 MARKs
    const priceValidUntil = 1514160000; // Valid until 12/25/2017

    let hash;
    let ecSignature = {};

    const getDINFromLog = async () => {
        const registrationEvent = registry.NewRegistration({ owner: bob });
        const eventAsync = Promise.promisifyAll(registrationEvent);
        const logs = await eventAsync.getAsync();

        const DIN = parseInt(logs[0]["args"]["DIN"]);
        return DIN;
    };

    before(async () => {
        buy = await Buy.deployed();
        registry = await DINRegistry.deployed();
        registrar = await DINRegistrar.deployed();
        token = await MarketToken.deployed();

        await registrar.registerDIN({ from: bob });
        DIN = await getDINFromLog();

        // Bob signs off on the price of his product
        // http://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3
        hash = utils.soliditySha3(DIN, price, priceValidUntil);
        const signature = web3.eth.sign(bob, hash);

        // And provides buyers with the elliptic curve signature parameters
        // https://ethereum.stackexchange.com/questions/1777/workflow-on-signing-a-string-with-private-key-followed-by-signature-verificatio/1794#1794
        ecSignature.r = signature.slice(0, 66);
        ecSignature.s = "0x" + signature.slice(66, 130);
        const v = "0x" + signature.slice(130, 132);
        ecSignature.v = web3.toDecimal(v) + 27;
    });

    it("should have the correct registry and token", async () => {
        const buyRegistry = await buy.registry();
        expect(buyRegistry).to.equal(registry.address);

        const buyToken = await buy.marketToken();
        expect(buyToken).to.equal(token.address);
    })

    it("should throw if the user does not have enough tokens for a purchase", async () => {
        const result = await buy.buy(
            DIN,
            quantity,
            price,
            priceValidUntil,
            ecSignature.v,
            ecSignature.r,
            ecSignature.s,
            { from: bob } // Bob has zero Market Tokens
        );
        expect(result.logs[0].event).to.equal("LogError");
    });

    it("should throw if the expired time has passed", async () => {
        const result = await buy.buy(
            DIN,
            quantity,
            price,
            1506988800, // 10/03/17
            ecSignature.v,
            ecSignature.r,
            ecSignature.s,
            { from: alice }
        );
        expect(result.logs[0].event).to.equal("LogError");
    });

    it("should throw if the price is zero", async () => {
        const result = await buy.buy(
            DIN,
            quantity,
            0,
            priceValidUntil,
            ecSignature.v,
            ecSignature.r,
            ecSignature.s,
            { from: alice }
        );
        expect(result.logs[0].event).to.equal("LogError");
    });

    it("should validate a signature", async () => {
        const valid = await buy.isValidSignature(
            bob,
            hash,
            ecSignature.v,
            ecSignature.r,
            ecSignature.s
        );
        expect(valid).to.equal(true);

        const invalid = await buy.isValidSignature(
            bob,
            hash,
            26,
            ecSignature.r,
            ecSignature.s
        );
        expect(invalid).to.equal(false);
    });

    it("should allow a purchase with valid parameters", async() => {
        const orderIndex = await buy.orderIndex();
        expect(orderIndex.toNumber()).to.equal(0);

        const owner = await registry.owner(DIN);
        expect(owner).to.equal(bob);

        const result = await buy.buy(
            DIN,
            quantity,
            price,
            priceValidUntil,
            ecSignature.v,
            ecSignature.r,
            ecSignature.s,
            { from: alice }
        );

        const newIndex = await buy.orderIndex();
        expect(newIndex.toNumber()).to.equal(1);
    });

});