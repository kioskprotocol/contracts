const Buy = artifacts.require("Buy.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const MarketToken = artifacts.require("MarketToken.sol");
const Promise = require("bluebird");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();
const utils = require("web3-utils");

contract("Buy", accounts => {
    let buy;
    let registrar;
    let hash;
    let ecSignature = {};
    const alice = accounts[0];

    const price1 = 0.25 * Math.pow(10, 18);
    const price2 = 0.5 * Math.pow(10, 18);
    const price3 = 1 * Math.pow(10, 18);
    const price4 = 5 * Math.pow(10, 18);
    const price5 = 10 * Math.pow(10, 18);

    // Sample products
    const hash1 = utils.soliditySha3(1000000001, price1, 1514160000);
    const hash2 = utils.soliditySha3(1000000002, price2, 1514160000);
    const hash3 = utils.soliditySha3(1000000003, price3, 1514160000);
    const hash4 = utils.soliditySha3(1000000004, price4, 1514160000);
    const hash5 = utils.soliditySha3(1000000005, price5, 1514160000);

    const sig1 = web3.eth.sign(alice, hash1);
    const sig2 = web3.eth.sign(alice, hash2);
    const sig3 = web3.eth.sign(alice, hash3);
    const sig4 = web3.eth.sign(alice, hash4);
    const sig5 = web3.eth.sign(alice, hash5);

    before(async () => {
        buy = await Buy.deployed();
        registrar = await DINRegistrar.deployed();

        console.log(hash1);
        console.log(hash2);
        console.log(hash3);
        console.log(hash4);
        console.log(hash5);

        console.log(sig1);
        console.log(sig2);
        console.log(sig3);
        console.log(sig4);
        console.log(sig5);

        await registrar.registerDINs(5, { from: alice });

        const sigs = [sig1, sig2, sig3, sig4, sig5];

        for (let i = 0; i < sigs.length; i++) {
            const signature = sigs[i];
            ecSignature.r = signature.slice(0, 66);
            ecSignature.s = "0x" + signature.slice(66, 130);
            const v = "0x" + signature.slice(130, 132);
            ecSignature.v = web3.toDecimal(v) + 27;
            console.log(ecSignature);
        }
    });

    it("should validate a signature", async () => {
        // Product 5
        const valid = await buy.isValidSignature(
            alice,
            hash5,
            ecSignature.v,
            ecSignature.r,
            ecSignature.s
        );
        expect(valid).to.equal(true);
    });

});