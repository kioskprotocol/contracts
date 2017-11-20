const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const PublicURLResolver = artifacts.require("PublicURLResolver.sol");
const StandardResolver = artifacts.require("StandardResolver.sol");
const ResolverFactory = artifacts.require("ResolverFactory.sol");
const MarketToken = artifacts.require("MarketToken.sol");
const Checkout = artifacts.require("Checkout.sol");
const Cart = artifacts.require("Cart.sol");
const genesis = 1000000000; // The first DIN.
const initialSupply = 50000000 * Math.pow(10, 18); // 50 million tokens.
const productURL = "https://kiosk-shopify.herokuapp.com/products/";

module.exports = async (deployer, network, accounts) => {
    // Deploy DINRegistry
    deployer.deploy(DINRegistry, genesis).then(async () => {
        // Deploy DINRegistrar
        await deployer.deploy(DINRegistrar, DINRegistry.address, genesis);
        // Set the registrar on DINRegistry
        await DINRegistry.at(DINRegistry.address).setRegistrar(
            DINRegistrar.address
        );
        // Deploy PublicURLResolver
        await deployer.deploy(PublicURLResolver, DINRegistry.address);
        // Deploy ResolverFactory
        await deployer.deploy(ResolverFactory, DINRegistry.address);
        // Deploy a StandardResolver
        await deployer.deploy(
            StandardResolver,
            DINRegistry.address,
            accounts[0],
            productURL,
            accounts[1]
        );
        // Deploy MarketToken
        await deployer.deploy(MarketToken, initialSupply);
        // Deploy Checkout
        await deployer.deploy(
            Checkout,
            MarketToken.address,
            DINRegistry.address
        );
        // Set the checkout contract on MarketToken
        await MarketToken.at(MarketToken.address).setCheckout(Checkout.address);
        // Deploy Cart
        await deployer.deploy(Cart);
        // Register 10 DINs
        await DINRegistrar.at(DINRegistrar.address).registerDINs(10);
        // Set resolver of first DIN
        await DINRegistry.at(DINRegistry.address).setResolver(
            1000000001,
            StandardResolver.address
        );
        // Set resolver of second DIN
        await DINRegistry.at(DINRegistry.address).setResolver(
            1000000002,
            StandardResolver.address
        );
        // Set resolver of third DIN
        await DINRegistry.at(DINRegistry.address).setResolver(
            1000000003,
            StandardResolver.address
        );
        // Add an item to the cart
        await Cart.at(Cart.address).addToCart(1000000001);
        await Cart.at(Cart.address).addToCart(1000000002);
    });
};