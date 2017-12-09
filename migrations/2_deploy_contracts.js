const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const StandardResolver = artifacts.require("StandardResolver.sol");
const ResolverFactory = artifacts.require("ResolverFactory.sol");
const MarketToken = artifacts.require("MarketToken.sol");
const Orders = artifacts.require("Orders.sol");
const Rewards = artifacts.require("Rewards.sol");
const Checkout = artifacts.require("Checkout.sol");
const Cart = artifacts.require("Cart.sol");
const LoyaltyTokenRegistry = artifacts.require("LoyaltyTokenRegistry.sol");
const LoyaltyToken = artifacts.require("LoyaltyToken.sol");
const genesis = 1000000000; // The first DIN.
const initialSupply = 50000000 * Math.pow(10, 18); // 50 million tokens.
const productURL = "https://kiosk-shopify.herokuapp.com/products/";

module.exports = async (deployer, network, accounts) => {
    const merchant = accounts[0];

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
        );
        // Deploy Orders
        await deployer.deploy(Orders);
        // Deploy MarketToken
        await deployer.deploy(MarketToken, initialSupply);
        // Deploy LoyaltyTokenRegistry
        await deployer.deploy(LoyaltyTokenRegistry);
        // Deploy Rewards
        await deployer.deploy(Rewards, MarketToken.address, LoyaltyTokenRegistry.address);
        // Set rewards on Market Token
        await MarketToken.at(MarketToken.address).setRewards(Rewards.address);
        // Set rewards on LoyaltyTokenRegistry
        await LoyaltyTokenRegistry.at(LoyaltyTokenRegistry.address).setRewards(Rewards.address);
        // Deploy Checkout
        await deployer.deploy(
            Checkout,
            DINRegistry.address,
            Orders.address,
            Rewards.address
        );
        // Add checkout to Rewards
        await Rewards.at(Rewards.address).addCheckout(Checkout.address);
        // Create LoyaltyToken
        await LoyaltyTokenRegistry.at(LoyaltyTokenRegistry.address).createToken(
            "Ethereum Bookstore",
            "BOOK",
            1000000, // Issue 1 million tokens to the merchant
            merchant
        );
        // Register 10 DINs and set their resolvers
        await DINRegistrar.at(DINRegistrar.address).registerDINsWithResolver(merchant, StandardResolver.address, 10);
    });
};