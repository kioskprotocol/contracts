const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistryUtils = artifacts.require("DINRegistryUtils.sol");
const StandardResolver = artifacts.require("StandardResolver.sol");
const ResolverFactory = artifacts.require("ResolverFactory.sol");
const Orders = artifacts.require("Orders.sol");
const EtherMarket = artifacts.require("EtherMarket.sol");
const genesis = 1000000000; // The first DIN.
const initialSupply = 50000000 * Math.pow(10, 18); // 50 million tokens.
const productURL = "https://api.examplestore.com/products/";

module.exports = async (deployer, network, accounts) => {
    const merchant = accounts[0];

    // Deploy DINRegistry
    deployer.deploy(DINRegistry, genesis).then(async () => {
        // Deploy DINRegistryUtils
        await deployer.deploy(DINRegistryUtils, DINRegistry.address);
        // Deploy ResolverFactory
        await deployer.deploy(ResolverFactory);
        // Deploy a StandardResolver
        await deployer.deploy(
            StandardResolver,
            merchant,
            productURL,
        );
        // Deploy Orders
        await deployer.deploy(Orders);
        // Deploy Checkout
        await deployer.deploy(
            EtherMarket,
            DINRegistry.address,
            Orders.address
        );
        // Register 10 DINs and set their resolvers
        // await DINRegistry.at(DINRegistry.address).registerDINsWithResolver(merchant, StandardResolver.address, 10);
    });
};