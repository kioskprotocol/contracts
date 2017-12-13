var Wallet = require("ethereumjs-wallet");
var ProviderEngine = require("web3-provider-engine");
var FiltersSubprovider = require("web3-provider-engine/subproviders/filters.js");
var WalletSubprovider = require("web3-provider-engine/subproviders/wallet.js");
const FetchSubprovider = require("web3-provider-engine/subproviders/fetch.js");
require("dotenv").config();

var PRIVATE_KEY = process.env.PRIVATE_KEY;
var INFURA_TOKEN = process.env.INFURA_ACCESS_TOKEN;

function InfuraProvider(infuraURL) {
    var privateKeyBuffer = new Buffer(PRIVATE_KEY, "hex");
    this.wallet = new Wallet(privateKeyBuffer);
    this.address = "0x" + this.wallet.getAddress().toString("hex");
    this.engine = new ProviderEngine();
    this.engine.addProvider(new WalletSubprovider(this.wallet, {}));
    this.engine.addProvider(new FiltersSubprovider());
    this.engine.addProvider(new FetchSubprovider({ rpcUrl: infuraURL }));
    this.engine.start(); // Required by the provider engine.
}

InfuraProvider.prototype.sendAsync = function() {
    this.engine.sendAsync.apply(this.engine, arguments);
};

InfuraProvider.prototype.send = function() {
    return this.engine.send.apply(this.engine, arguments);
};

InfuraProvider.prototype.getAddress = function() {
    return this.address;
};

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 7545, // Ganache
            network_id: "*" // Match any network id
        },
        ropsten: {
            provider: function() {
                return new InfuraProvider(
                    "https://ropsten.infura.io/" + INFURA_TOKEN
                );
            },
            network_id: 3
        },
        rinkeby: {
            provider: function() {
                return new InfuraProvider(
                    "https://rinkeby.infura.io/" + INFURA_TOKEN
                );
            },
            network_id: 4
        },
        kovan: {
            provider: function() {
                return new InfuraProvider(
                    "https://kovan.infura.io/" + INFURA_TOKEN
                );
            },
            network_id: 42,
            gas: 4000000
        }
    }
};