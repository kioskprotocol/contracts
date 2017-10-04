const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const PublicURLResolver = artifacts.require("PublicURLResolver.sol");
const MarketToken = artifacts.require("MarketToken.sol");
const Buy = artifacts.require("Buy.sol");
const genesis = 1000000000; // The first DIN.
const initialSupply = 50000000 * Math.pow(10, 18); // 50 million tokens.

module.exports = async (deployer, network, accounts) => {
  // Deploy DINRegistry
  deployer.deploy(DINRegistry, genesis).then(async () => {
    // Deploy DINRegistrar  	
    await deployer.deploy(DINRegistrar, DINRegistry.address, genesis);
    // Set the registrar on DINRegistry
    await DINRegistry.at(DINRegistry.address).setRegistrar(DINRegistrar.address);
    // Deploy PublicURLResolver
    await deployer.deploy(PublicURLResolver, DINRegistry.address);
    // Deploy MarketToken
    await deployer.deploy(MarketToken, initialSupply);
    // Deploy Buy
    await deployer.deploy(Buy, MarketToken.address, DINRegistry.address);
    // Set the buy contract on MarketToken
    await MarketToken.at(MarketToken.address).setBuy(Buy.address);
  }) 
};
