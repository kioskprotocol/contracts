const MarketToken = artifacts.require("MarketToken.sol");
const Checkout = artifacts.require("Checkout.sol");
const Promise = require("bluebird");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();

contract("MarketToken", accounts => {
    let token;
    let checkout;
    const initialSupply = 50000000 * Math.pow(10, 18); // 50 million tokens.
    const alice = accounts[1];
    const bob = accounts[0];

    before(async () => {
        token = await MarketToken.deployed();
        checkout = await Checkout.deployed();
    });

    it("should have the correct total supply", async () => {
        const totalSupply = await token.totalSupply();
        expect(totalSupply.toNumber()).to.equal(initialSupply);
    });

    it("should let a user transfer tokens", async () => {
        const aliceBalance = await token.balanceOf(alice);
        expect(aliceBalance.toNumber()).to.equal(0);

        const bobBalance = await token.balanceOf(bob);
        expect(bobBalance.toNumber()).to.equal(initialSupply);

        const amount = 20000 * Math.pow(10, 18); // Transfer 20,000 tokens
        await token.transfer(alice, amount, { from: bob });

        const newBalance = await token.balanceOf(alice);
        expect(newBalance.toNumber()).to.equal(amount);
    });

    it("should throw if an account calls transferFromRewards", async () => {
        try {
            await token.transferFromRewards(alice, bob, 50000, { from: alice });
        } catch (error) {
            assert.include(
                error.message,
                "invalid opcode",
                "Trying to call transferFromCheckout should throw an error."
            );
        }
    });

    it("should throw if an account calls setRewards", async () => {
        const newRewards = "0x1111111111111111111111111111111111111111";

        try {
            await token.setRewards(newRewards, { from: alice });
        } catch (error) {
            assert.include(
                error.message,
                "invalid opcode",
                "Trying to set the checkout contract from an unauthorized account should throw an error."
            );
        }
    });

});