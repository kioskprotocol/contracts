const Cart = artifacts.require("Cart.sol");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();

contract("Cart", accounts => {
    let cart;
    const DIN = 1000000001;

    before(async () => {
        cart = await Cart.deployed();
    });

    it("should add to cart", async () => {
        const result = await cart.addToCart(DIN);
        const event = result.logs[0].event;
        expect(event).to.equal("AddToCart");
    });

    it("should remove from cart", async () => {
        const result = await cart.removeFromCart(DIN);
        const event = result.logs[0].event;
        expect(event).to.equal("RemoveFromCart");
    });

    it("should empty cart", async () => {
        const result = await cart.emptyCart();
        const event = result.logs[0].event;
        expect(event).to.equal("EmptyCart");
    });
});