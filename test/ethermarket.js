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
    const BUYER = accounts[1];

    // The merchant needs to sign off-chain inputs (price, priceValidUntil, etc.)
    const MERCHANT_PRIVATE_KEY =
        "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";

    let DIN;
    const UNIT_PRICE = web3.toWei(1, "ether");

    const EXPIRED_DATE = 1483228800; // 1/1/2017
    const FUTURE_DATE = 1577836800; // 1/1/2020

    const NONCE = "123";
    const NONCE_HASH = web3.sha3(NONCE);

    // Errors
    const ERROR_OFFER_EXPIRED = "Offer expired";
    const ERROR_INVALID_MERCHANT = "Invalid merchant";
    const ERROR_VALUE_TOO_LOW = "Value too low";
    const ERROR_INVALID_SIGNATURE = "Invalid signature";

    before(async () => {
        market = await EtherMarket.deployed();
        registry = await DINRegistry.deployed();
        orders = await Orders.deployed();

        // Register a new DIN to the merchant
        const result = await registry.selfRegisterDIN();
        DIN = parseInt(result.logs[0].args.DIN, 10);
    });

    const sign = (product, privateKey) => {
        const hash = solidityHash(product);
        const prefix = "\x19Ethereum Signed Message:\n32";
        const messageHash = Utils.soliditySha3(prefix, hash);
        const signature = Account.sign(messageHash, privateKey);
        const vrs = Account.decodeSignature(signature);
        const v = vrs[0];
        return {
            v: Utils.toDecimal(v),
            r: vrs[1],
            s: vrs[2]
        };
    };

    const solidityHash = product => {
        return Utils.soliditySha3(
            { type: "address", value: product.market },
            { type: "uint256", value: product.DIN },
            { type: "uint256", value: product.unitPrice },
            { type: "uint256", value: product.priceValidUntil },
            { type: "address", value: product.merchant }
        );
    };

    const orderValues = (product, quantity) => {
        return [
            product.DIN,
            quantity,
            quantity * product.unitPrice,
            product.priceValidUntil
        ];
    };

    const orderAddresses = product => {
        return [product.merchant];
    };

    const buyProduct = async (product, quantity) => {
        const qty = quantity ? quantity : 1;
        const values = orderValues(product, qty);
        const addresses = orderAddresses(product);
        const signature = sign(product, MERCHANT_PRIVATE_KEY);
        const result = await market.buyProduct(
            values,
            addresses,
            NONCE_HASH,
            signature.v,
            signature.r,
            signature.s,
            {
                from: BUYER,
                value: product.unitPrice * qty
            }
        );
        return result;
    };

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
        };
        const hash = solidityHash(product);
        const signature = sign(product, MERCHANT_PRIVATE_KEY);
        const valid = await market.isValidSignature(
            MERCHANT,
            hash,
            signature.v,
            signature.r,
            signature.s
        );
        expect(valid).to.equal(true);
    });

    it("should log an error if priceValidUntil has expired", async () => {
        const product = {
            market: market.address,
            DIN: DIN,
            unitPrice: UNIT_PRICE,
            priceValidUntil: EXPIRED_DATE,
            merchant: MERCHANT
        };
        const result = await buyProduct(product);
        expect(result.logs[0].args.error).to.equal(ERROR_OFFER_EXPIRED);
    });

    // it("should log an error if the merchant is null", async () => {});

    it("should log an error if the value is too low", async () => {
        const product = {
            market: market.address,
            DIN: DIN,
            unitPrice: UNIT_PRICE,
            priceValidUntil: FUTURE_DATE,
            merchant: MERCHANT
        };
        const values = orderValues(product);
        const addresses = orderAddresses(product);
        const signature = sign(product, MERCHANT_PRIVATE_KEY);
        const result = await market.buyProduct(
            values,
            addresses,
            NONCE_HASH,
            signature.v,
            signature.r,
            signature.s,
            {
                from: BUYER,
                value: 0
            }
        );
        expect(result.logs[0].args.error).to.equal(ERROR_VALUE_TOO_LOW);
    });

    it("should buy a product", async () => {
        const product = {
            market: market.address,
            DIN: DIN,
            unitPrice: UNIT_PRICE,
            priceValidUntil: FUTURE_DATE,
            merchant: MERCHANT
        };
        const result = await buyProduct(product);
        expect(result.receipt.logs[0].topics[0]).to.equal(
            web3.sha3("NewOrder(uint256,address,bytes32,uint256[],uint256[])")
        );
    });

    it("should buy a given quantity of a product", async () => {
        const quantity = 5;
        const product = {
            market: market.address,
            DIN: DIN,
            unitPrice: UNIT_PRICE,
            priceValidUntil: FUTURE_DATE,
            merchant: MERCHANT
        };
        const result = await buyProduct(product, 5);
        expect(result.receipt.logs[0].topics[0]).to.equal(
            web3.sha3("NewOrder(uint256,address,bytes32,uint256[],uint256[])")
        );
        console.log(result.receipt.logs);
    });
});