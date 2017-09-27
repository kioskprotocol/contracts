# Kiosk

Kiosk is a protocol that uses smart contracts to organize a decentralized, global product database.

# How It Works

### DIN

A Decentralized Identification Number (DIN) is a globally unique, 10-digit number that can be used for product identification.

### Register a New DIN

The easiest way to register a new DIN is to use MyEtherWallet (https://www.myetherwallet.com/). Go to the website, click on Contracts, and then paste in the following Contract Address and ABI.

**Contract Address**
```
0xcfe8f8dcd29419ba396a496ad2317b784ec23d60
```
**ABI**
```js
[{"constant":false,"inputs":[],"name":"registerDIN","outputs":[{"name":"DIN","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"index","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"quantity","type":"uint256"}],"name":"registerDINs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_QUANTITY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_registry","type":"address"},{"name":"_genesis","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
```

You'll need a small amount of Ether in your account (less than $1) to register a DIN. You can select to register a single DIN or multiple DINs. The maximum amount is 10 for a single transaction.

### Resolver

A resolver contract is responsible for managing product information.

### Add a Resolver

*Coming soon!*

## Deployed Contracts

**[DINRegistry.sol](https://etherscan.io/address/0x79bf32b2c0f9a3f30fbcc4aa1e3e07e3366b34f9#code)**
```
Ethereum Main Network Address: 0x79bf32b2c0f9a3f30fbcc4aa1e3e07e3366b34f9
Kovan Test Network Address: 0xa26993945449fe1bdf22253fd2583da184e90b56
ABI: [{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registrar","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"genesis","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"updated","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"owner","type":"address"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_registrar","type":"address"}],"name":"setRegistrar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_genesis","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"DIN","type":"uint256"},{"indexed":true,"name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"DIN","type":"uint256"},{"indexed":true,"name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"DIN","type":"uint256"},{"indexed":true,"name":"owner","type":"address"}],"name":"NewRegistration","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"registrar","type":"address"}],"name":"NewRegistrar","type":"event"}]
```

**[DINRegistrar.sol](https://etherscan.io/address/0xcfe8f8dcd29419ba396a496ad2317b784ec23d60#code)**
```
Ethereum Main Network Address: 0xcfe8f8dcd29419ba396a496ad2317b784ec23d60
Kovan Test Network Address: 0xe41d67a3e7866f84bd5db17492a744de23b08df2
ABI: [{"constant":false,"inputs":[],"name":"registerDIN","outputs":[{"name":"DIN","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"index","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"quantity","type":"uint256"}],"name":"registerDINs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_QUANTITY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_registry","type":"address"},{"name":"_genesis","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
```

## Roadmap

* Decentralized Identification Number (DIN) ✅
* Global product database
  * Resolver contracts *(in progress)*
  * Javascript API *(in progress)*
  * REST API *(in progress)*
* Decentralized exchange
  * Pricing
  * Market Token (marks)
  * Identity
* Developer platform
  * Client interfaces (decentralized applications) for search, buy, sell
  * Custom market rules (escrow, loyalty, etc.)
* Reputation system
