const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const genesis = 1000000000; // The first DIN.

module.exports = async deployer => {
  // Deploy DINRegistry
  deployer.deploy(DINRegistry, genesis).then(async () => {
    // Deploy DINRegistrar  	
    await deployer.deploy(DINRegistrar, DINRegistry.address, genesis);
    // Set the registrar on DINRegistry
    await DINRegistry.at(DINRegistry.address).setRegistrar(DINRegistrar.address);
  }) 
};
