# Kiosk

Kiosk is a decentralized e-commerce platform built on Ethereum.

**Kiosk for Merchants:**
* Register a globally unique product identifier (DIN) for each of your products
* Manage product information and pricing off-chain using your existing e-commerce backend
* Sell products directly to buyers with no middlemen and no transaction fees
* Create your own loyalty token to incentivize repeat purchases

**Kiosk for Buyers:**
* Purchase products online without a credit card
* Earn loyalty tokens from merchants

**Kiosk for Affiliates:**
* Earn Market Tokens from merchants for successful referrals

**Kiosk for Developers:**
* Earn Market Tokens for contributions to the core protocol
* Build your own e-commerce client

## Testing

Requirements:
* Install [Node.js](https://nodejs.org/en/)
* Install [Truffle](http://truffleframework.com/) 

Download the project and install its dependencies.
```
git clone https://github.com/kioskprotocol/contracts.git
npm install
```

In a separate terminal tab, create an in-memory blockchain with Truffle.
```
truffle develop
```

Then, in the root directory of the project, run the tests with Truffle.
```
truffle test
```
