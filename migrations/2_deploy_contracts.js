const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const StandardResolver = artifacts.require("StandardResolver.sol");
const ResolverFactory = artifacts.require("ResolverFactory.sol");
const MarketToken = artifacts.require("MarketToken.sol");
const Orders = artifacts.require("Orders.sol");
const Checkout = artifacts.require("Checkout.sol");
const Cart = artifacts.require("Cart.sol");
const LoyaltyTokenRegistry = artifacts.require("LoyaltyTokenRegistry.sol");
const LoyaltyToken = artifacts.require("LoyaltyToken.sol");
const genesis = 1000000000; // The first DIN.
const initialSupply = 50000000 * Math.pow(10, 18); // 50 million tokens.
const productURL = "https://kiosk-shopify.herokuapp.com/products/";

module.exports = async (deployer, network, accounts) => {
    const buyer = accounts[0];
    const merchant = accounts[1];

    // Deploy DINRegistry
    deployer.deploy(DINRegistry, genesis).then(async () => {
        // Deploy DINRegistrar
        await deployer.deploy(DINRegistrar, DINRegistry.address, genesis);
        // Set the registrar on DINRegistry
        await DINRegistry.at(DINRegistry.address).setRegistrar(
            DINRegistrar.address
        );
        // Deploy ResolverFactory
        await deployer.deploy(ResolverFactory, DINRegistry.address);
        // Deploy a StandardResolver
        await deployer.deploy(
            StandardResolver,
            DINRegistry.address,
            merchant,
            productURL,
            merchant
        );
        // Deploy Orders
        await deployer.deploy(Orders);
        // Deploy MarketToken
        await deployer.deploy(MarketToken, initialSupply);
        // Deploy LoyaltyTokenRegistry
        await deployer.deploy(LoyaltyTokenRegistry);
        // Deploy Checkout
        await deployer.deploy(
            Checkout,
            DINRegistry.address,
            Orders.address,
            MarketToken.address,
            LoyaltyTokenRegistry.address
        );
        // Set the checkout contract on MarketToken
        await MarketToken.at(MarketToken.address).setCheckout(Checkout.address);
        // Set the checkout contract on LoyaltyTokenRegistry
        await LoyaltyTokenRegistry.at(LoyaltyTokenRegistry.address).setCheckout(Checkout.address);
        // Create LoyaltyToken
        await LoyaltyTokenRegistry.at(LoyaltyTokenRegistry.address).createToken(
            "Ethereum Bookstore",
            "BOOK",
            merchant
        );
        // Deploy Cart
        await deployer.deploy(Cart);
        // Register 10 DINs
        await DINRegistrar.at(DINRegistrar.address).registerDINs(10, {
            from: merchant
        });
        // Set resolver of registered DINs
        for (let i = 1000000001; i <= 1000000003; i++) {
            await DINRegistry.at(
                DINRegistry.address
            ).setResolver(i, StandardResolver.address, { from: merchant });
        }
    });
};