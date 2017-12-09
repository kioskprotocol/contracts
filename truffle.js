var HDWalletProvider = require("truffle-hdwallet-provider");
require("dotenv").config();

var mnemonic = process.env.MNEMONIC;
var token = process.env.INFURA_ACCESS_TOKEN;

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 7545, // Ganache
            network_id: "*" // Match any network id
        },
        ropsten: {
            provider: function() {
                return new HDWalletProvider(
                    mnemonic,
                    "https://ropsten.infura.io/" + token
                );
            },
            network_id: 3
        },
        kovan: {
            provider: function() {
                return new HDWalletProvider(
                    mnemonic,
                    "https://kovan.infura.io/" + token
                );
            },
            network_id: 42
        }
    }
};