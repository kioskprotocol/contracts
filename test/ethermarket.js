const EtherMarket = artifacts.require("EtherMarket.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const Orders = artifacts.require("Orders.sol");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();
const Account = require("eth-lib/lib/account");
const Utils = require("web3-utils"); 

contract("EtherMarket", accounts => {
    let market;
    let registry;
    let orders;

    const MERCHANT = accounts[0];
    const MERCHANT_PRIVATE_KEY = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";

    const BUYER = accounts[1];

    const DIN = 1000000001;
    const UNIT_PRICE = web3.toWei(1, "ether");

    const FUTURE_DATE = 1577836800; // 1/1/2020

    before(async () => {
        market = await EtherMarket.deployed();
        registry = await DINRegistry.deployed();
        orders = await Orders.deployed();
    });

    const sign = (product, privateKey) => {
        const hash = Utils.soliditySha3(
            { type: "address", value: product.market },
            { type: "uint256", value: product.DIN },
            { type: "uint256", value: product.unitPrice },
            { type: "uint256", value: product.priceValidUntil },
            { type: "address", value: product.merchant }
        );
        var prefix = "\x19Ethereum Signed Message:\n32";
        var messageHash = Utils.soliditySha3(prefix, hash);
        var signature = Account.sign(messageHash, privateKey);
        var vrs = Account.decodeSignature(signature);
        var v = vrs[0];
        return {
            v: Utils.toDecimal(v),
            r: vrs[1],
            s: vrs[2]
        };
    }

    it("should have the correct registry address", async () => {
        const registryAddr = await market.registry();
        expect(registryAddr).to.equal(registry.address);
    });

    it("should have the correct orders address", async () => {
        const ordersAddr = await market.orders();
        expect(ordersAddr).to.equal(orders.address);
    });

    it("should validate a signature", async () => {
        const product = {
            market: market.address,
            DIN: DIN,
            unitPrice: UNIT_PRICE,
            priceValidUntil: FUTURE_DATE,
            merchant: MERCHANT
        }
        const signature = sign(product, MERCHANT_PRIVATE_KEY);
        console.log(signature);
    });

    // it("should log an error if priceValidUntil has expired", async () => {});

    // it("should log an error if the merchant is null", async () => {});
});