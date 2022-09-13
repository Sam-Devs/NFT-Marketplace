# DOD NFT Marketplace
<i>NFT marketplace DApp where users mint ERC721 implemented  DOD NFTs.</i>

### Features
- Mint custom ERC721 implemented DOD Tokens.
- Sell DOD tokens on the marketplace.
- Set desired token price.
- Toggle between keeping the token for sale and not for sale.
- Keeps track of all the tokens owned by an account - minted and bought.
- Query blockchain for token owner.
- User can mint a token only after every 5 minutes.
#
### Stack
- [Solidity](https://docs.soliditylang.org/en/v0.7.6/) - Object-oriented, high-level language for implementing smart contracts.
- [Bootstrap 4](https://getbootstrap.com/) - CSS framework for faster and easier web development.
- [React.js](https://reactjs.org/) - JavaScript library for building user interfaces.
- [web3.js](https://web3js.readthedocs.io/en/v1.3.4/) - Allows users to interact with a local or remote ethereum node using HTTP, IPC or WebSocket.
- [Hardhat](https://hardhat.org/) - Development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM).
- [Ox](https://docs.0x.org/) - Hanldles NFT transfer and payment between buyers and sellers.
#
### Interact with the deployed DApp
- DOD Marketplace DApp requires [Metamask](https://metamask.io/) browser wallet extension to interact with.
- Connect metamask browser wallet to Polygon Test Network (matic).
- Request and get test matic for the metamask account from [Polygon matic Faucet](https://faucet.polygon.technology/) to make transactions.
- Request and get test USDC for the metamask account from [Filswan Faucet](https://calibration-faucet.filswan.com/#/dashboard) to buy NFTs.
- 100 USDC test token will be sent to your wallet and to access it you have to import the USDC test token contract address into metamask account from [Filswan Faucet](https://docs.filswan.com/development-resource/swan-token-contract/acquire-testnet-usdc-and-matic-tokens) to be able to buy NFTs.
- DOD NFT Marketplace Smart Contract is deployed to polygon Testnet - [0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a](https://mumbai.polygonscan.com/address/0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a)
- Access DOD Marketplace DApp at [DOD-NFT-marketplace](https://dod-nft-marketplace.netlify.app/) and start minting your DOD NFT.
#
### Run the DApp Locally
#### Install dependencies
```
npm i
```
#### Start App

```
yarn start
```
#### Build App

```
yarn build
```
- Open metamask browser wallet and connect network.
