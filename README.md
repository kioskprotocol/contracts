# Kiosk

Kiosk is a protocol for decentralized commerce using Ethereum smart contracts.

The protocol enables product owners to:
* Register a globally unique product identifier for each of their products
* Manage product information and pricing in a decentralized product database
* Sell products directly to buyers with no middlemen and no transaction fees

## Quick Start

The following tutorials will prepopulate the relevant smart contracts in [Remix](http://remix.ethereum.org/), a browser-based Solidity compiler. This is the quickest way to interact with the contracts.

* [Register an Identifier](https://ethereum.github.io/browser-solidity/#version=soljson-v0.4.16+commit.d7661dd9.js&optimize=undefined&gist=a18216ae0c4901dcd5aa18e46a10048a)
* [Add a Product](https://ethereum.github.io/browser-solidity/#version=soljson-v0.4.17+commit.bdeb9e52.js&optimize=undefined&gist=18b724ea3741f01af28faf3c3d8e515b)

## How It Works

### DIN

A Decentralized Identification Number (DIN) is a globally unique, 10-digit number that can be used for product identification.

### Register a New DIN

You can register a new identifier for your product via the [DINRegistrar](contracts/DINRegistrar.sol) smart contract.

In a web3-enabled Javascript environment, input the following:
```
> const registrarABI = [{"constant":false,"inputs":[],"name":"registerDIN","outputs":[{"name":"DIN","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"index","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"quantity","type":"uint256"}],"name":"registerDINs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_QUANTITY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_registry","type":"address"},{"name":"_genesis","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
> const registrarAddress = "0xcfe8f8dcd29419ba396a496ad2317b784ec23d60"
> const registrar = web3.eth.contract(registrarABI).at(registrarAddress)

// Register a single DIN
> registrar.registerDIN((error, result) => { console.log(result) })

// Register multiple DINs (maximum 10 in one transaction)
> registrar.registerDINs(10, (error, result) => { console.log(result) })
```

### Resolver

A resolver contract is responsible for managing product information.

### Add a Resolver

A resolver must implement the following methods:

```
function supportsInterface(bytes4 interfaceID) constant returns (bool)
function productURL(uint256 DIN) public constant returns (string)
```

For now, only URL resolvers are supported. In the future, we may add support for [IPFS](https://ipfs.io/) and other types of resolvers.

If you are only listing a few products, you should use the [PublicURLResolver](contracts/resolvers/PublicURLResolver.sol). Otherwise, you can deploy your own [URLResolver](contracts/resolvers/URLResolver.sol) contract.

```
contract MyURLResolver is URLResolver {
    bytes4 constant INTERFACE_META_ID = 0x01ffc9a7;         // bytes4(sha3("supportsInterface(bytes4)"))
    bytes4 constant PRODUCT_URL_INTERFACE_ID = 0xaf655719;  // bytes4(sha3("productURL(uint256)"))
    
    function supportsInterface(bytes4 interfaceID) public constant returns (bool) {
        return interfaceID == INTERFACE_META_ID ||
               interfaceID == PRODUCT_URL_INTERFACE_ID;
    }

    function productURL(uint256 DIN) public constant returns (string) {
        return "https://www.api.myproducts.com/";
    }
}
```

The Kiosk protocol will find the product URL for a given DIN and pass in the DIN as a parameter. For example, if the owner of DIN `1000000001` sets the above resolver for his product, a client should be able to retrieve the relevant product information from:

```
https://www.api.myproducts.com/1000000001
```

When your resolver is deployed, be sure to update the [DINRegistry](contracts/DINRegistry.sol).

```
function setResolver(uint256 DIN, address resolver) only_owner(DIN)
```

### Response Schema

Your product URL must implement the response schema specified in the [Kiosk API](https://github.com/kioskprotocol/api#example-response). A consistent schema allows clients of the Kiosk protocol to easily parse product information.

We will add plug-ins for popular e-commerce platforms like WooCommerce, Shopify, and Magento to make this process as easy as possible. Stay tuned!

## Deployed Contracts

**[DINRegistry.sol](contracts/DINRegistry.sol)**
```
Ethereum Main Network Address: 0x79bf32b2c0f9a3f30fbcc4aa1e3e07e3366b34f9
Kovan Test Network Address: 0xa26993945449fe1bdf22253fd2583da184e90b56

ABI: 
[{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registrar","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"genesis","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"updated","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"owner","type":"address"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_registrar","type":"address"}],"name":"setRegistrar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_genesis","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"DIN","type":"uint256"},{"indexed":true,"name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"DIN","type":"uint256"},{"indexed":true,"name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"DIN","type":"uint256"},{"indexed":true,"name":"owner","type":"address"}],"name":"NewRegistration","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"registrar","type":"address"}],"name":"NewRegistrar","type":"event"}]
```

**[DINRegistrar.sol](contracts/DINRegistrar.sol)**
```
Ethereum Main Network Address: 0xcfe8f8dcd29419ba396a496ad2317b784ec23d60
Kovan Test Network Address: 0xe41d67a3e7866f84bd5db17492a744de23b08df2

ABI: 
[{"constant":false,"inputs":[],"name":"registerDIN","outputs":[{"name":"DIN","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"index","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"quantity","type":"uint256"}],"name":"registerDINs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_QUANTITY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_registry","type":"address"},{"name":"_genesis","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
```

**[PublicURLResolver.sol](contracts/resolvers/PublicURLResolver.sol)**
```
Kovan Test Network Address: 0xA9b81c7d571717f0817688252EF2C9cCc039B939

ABI: 
[{"constant":true,"inputs":[{"name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"productURL","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"URL","type":"string"}],"name":"setProductURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_registry","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
```
