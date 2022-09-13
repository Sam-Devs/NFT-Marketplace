import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import "./App.css";
import Web3 from "web3";
import { NftSwapV4 } from '@traderxyz/nft-swap-sdk'
import {ethers} from 'ethers';
import DODnfts from "../abis/DodNfts.json";
import FormAndPreview from "../components/FormAndPreview/FormAndPreview";
import AllDodNfts from "./AllDodNfts/AllDodNfts";
import AccountDetails from "./AccountDetails/AccountDetails";
import ContractNotDeployed from "./ContractNotDeployed/ContractNotDeployed";
import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
import Loading from "./Loading/Loading";
import Navbar from "./Navbar/Navbar";
import MyDodNfts from "./MyDodNfts/MyDodNfts";
import Queries from "./Queries/Queries";


const ipfsClient = require("ipfs-http-client");

const authorization = 'Basic ' + btoa('2EVVxxTErel2Mkp9hLUs0Eziklz'+ ':' + 'ae3354edec14e7d8ea7e82777115534d')
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
            headers: {
            authorization
        }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      accountBalance: "",
      DODnftsContract: null,
      DODnftsCount: 0,
      DODnfts: [],
      loading: true,
      metamaskConnected: false,
      contractDetected: false,
      totalTokensMinted: 0,
      totalTokensOwnedByAccount: 0,
      nameIsUsed: false,
      colorIsUsed: false,
      colorsUsed: [],
      lastMintTime: null,
      chainId: 80001,
      contractAddress: '0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a',
      text: ''
    };
  }

  componentDidMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setMintBtnTimer();
  };

  setMintBtnTimer = () => {
    const mintBtn = document.getElementById("mintBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTime: localStorage.getItem(this.state.accountAddress),
      });
      this.state.lastMintTime === undefined || this.state.lastMintTime === null
        ? (mintBtn.innerHTML = "Mint My Dod Nft")
        : this.checkIfCanMint(parseInt(this.state.lastMintTime));
    }
  };

  checkIfCanMint = (lastMintTime) => {
    const mintBtn = document.getElementById("mintBtn");
    const timeGap = 300000; //5min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Dod Nft";
        localStorage.removeItem(this.state.accountAddress);
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  loadBlockchainData = async () => {
    const web3 = new Web3(window.web3.currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const networkId = await web3.eth.net.getId();
      const networkData = this.state.chainId;
      if (networkData === networkId) {
        this.setState({ loading: true });
        const DodNftContract = new web3.eth.Contract(
          DODnfts,
          this.state.contractAddress
        );
        this.setState({ DodNftContract });
        this.setState({ contractDetected: true });
        let dodNftCount = await DodNftContract.methods.DodCounter().call({from: this.state.accountAddress})
         dodNftCount = dodNftCount.toNumber()
        this.setState({ dodNftCount});

        for (var i = 1; i <= dodNftCount; i++) {
          console.log(i)
          const DodNft = await DodNftContract.methods.oneDod(i).call({from: this.state.accountAddress})
          this.setState({
            DODnfts: [...this.state.DODnfts, DodNft],
          });
        }

        let totalTokensMinted = await DodNftContract
          .methods.totalSupply().call({from: this.state.accountAddress})
        totalTokensMinted = totalTokensMinted.toNumber();
        this.setState({ totalTokensMinted });
        let totalTokensOwnedByAccount = await DodNftContract.methods.fetchMyNFTs().call({from: this.state.accountAddress})
          const length = totalTokensOwnedByAccount? totalTokensOwnedByAccount.length : 0
        this.setState({ totalTokensOwnedByAccount: length});
        this.setState({ loading: false });
      } else {
        this.setState({ contractDetected: false });
      }
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };


  mintMyNFT = async ( dodName, dodPrice, imgDoc, src) => {
    this.setState({ loading: true });
    const nameIsUsed = await this.state.DodNftContract.methods
    .tokenNameExists(dodName).call({from: this.state.accountAddress})
    this.setState({ text: 'Checking NFT name availabilty'})
    if (nameIsUsed) {
      this.setState({ nameIsUsed: true });
      this.setState({ loading: false });
    } else{
      this.setState({ text: 'Do not close this window while minting is in progress'})
       try {
        const created = await ipfs.add(imgDoc)
        const ipfsImage = `https://dodnfts.infura-ipfs.io/ipfs/${created.path}`
      let nextTokenId;
      nextTokenId = await this.state.DodNftContract.methods.DodCounter().call({from: this.state.accountAddress})

      nextTokenId = nextTokenId.toNumber();
      const tokenObject = {
        tokenName: "DOD NFT",
        tokenSymbol: "DOD",
        image: ipfsImage,
        tokenId: `${nextTokenId}`,
        name: dodName,
      };
      const cid = await ipfs.add(JSON.stringify(tokenObject));
      let tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}`;
      const price = window.web3.utils.toWei(dodPrice.toString(), "Ether");
     
        await this.state.DodNftContract.methods.createToken(tokenURI, price, dodName, ipfsImage)
        .send({ from: this.state.accountAddress })
        .on('transactionHash', () => {  
          localStorage.setItem(this.state.accountAddress, new Date().getTime())
          this.setState({ loading: false });
          // window.location.reload()
          toast.success(<div><h4 style={{ color: 'white', fontWeight:'600'}}>Mint successful</h4> <p>Block confirmation could take a few minutes.</p> <p> Refresh marketplace in a few minutes to view newly minted NFT</p></div>, {
          });
       })

      } catch (error) {
        console.log(error, error.message)
        this.setState({ loading: false });
        toast.error(error.message? error.message.slice(0,30) : 'Mint failed');
      }
      
    }
  };

  addForSale = async (tokenId, price) => {
    this.setState({ loading: true });
    this.setState({ text: 'Do not close this window while NFT is being listed'})
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(this.state.accountAddress);
       const nftSwapSdk = new NftSwapV4(provider, signer, this.state.chainId);

         const DodNft = {
          tokenAddress: this.state.contractAddress, // CryptoPunk contract address
          tokenId: tokenId, // Token Id of the CryptoPunk we want to swap
          type: 'ERC721', // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
        };
        const payment_token = {
          tokenAddress: '0xe11a86849d99f524cac3e7a0ec1241828e332c62', // USDC contract address
          amount: price, // 69 USDC (USDC is 6 digits)
          type: 'ERC20',
        };


       const approvalStatusForUserA = await nftSwapSdk.loadApprovalStatus(
            DodNft,
            this.state.accountAddress
          );
          if (!approvalStatusForUserA.contractApproved) {
            const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
              DodNft,
              this.state.accountAddress
            );
            const approvalTxReceipt = await approvalTx.wait();
            console.log(
              `Approved ${DodNft.tokenAddress} contract to swap with 0x v4 (txHash: ${approvalTxReceipt.transactionHash})`
            );
          }

        const order = nftSwapSdk.buildOrder(
          DodNft,
          payment_token,
          this.state.accountAddress,
          {
            fees: [
              {
                amount: 0,
                recipient: this.state.contractAddress, // your DAO treasury 
              },
            ],
          }
        );
        const signedOrder = await nftSwapSdk.signOrder(order);
        await nftSwapSdk.postOrder(signedOrder, this.state.chainId).then( async ()=>{
              const listingFee = await this.state.DodNftContract.methods
              .getListingPrice().call({from: this.state.accountAddress})
            await this.state.DodNftContract.methods
              .createMarketItem(tokenId, )
              .send({ from: this.state.accountAddress, to:this.state.contractAddress, value:listingFee })
              .on('transactionHash', () => {  
                  this.setState({ loading: false });
                  // window.location.reload();
                   toast.success(<div><h4 style={{ color: 'white', fontWeight:'600'}} >NFT listed successfully</h4> <p>Block confirmation could take a few minutes.</p> <p> Refresh marketplace in a few minutes to view newly listed NFT</p></div>, {
                  })
                console.log('for sale activated')
           })
         })
      } catch (error) {
        console.log('error', error)
        this.setState({ loading: false });
        toast.error(error.message? error.message.slice(0,30) : ' NFT Listing failed');
    }
  };

   removeFromSale = async (tokenId) => {
    this.setState({ loading: true });
    this.setState({ text: 'Do not close this window while NFT is being unlisted'})
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(this.state.accountAddress);
       const nftSwapSdk = new NftSwapV4(provider, signer, this.state.chainId);
      const order = await nftSwapSdk.getOrders({
            nftToken: this.state.contractAddress,
            nftTokenId: tokenId,
            sellOrBuyNft: "sell", // Only show asks (sells) for this NFT (excludes asks)
          });
          console.log(order)
      const nonce = order.orders[0].order.nonce;
      await nftSwapSdk.cancelOrder(nonce, 'ERC721').then(async ()=>{
        await this.state.DodNftContract.methods
          .removeFromSale(tokenId)
          .send({ from: this.state.accountAddress})
          .on('transactionHash', () => {  
          this.setState({ loading: false });
          // window.location.reload()
           toast.success(<div><h4 style={{ color: 'white', fontWeight:'600'}} >DOD NFT unlisted successfully</h4> <p>Block confirmation could take a few minutes.</p> <p> Refresh marketplace in a few minutes to view newly unlisted NFT</p></div>, {
              })
       })
      })
    } catch (error) {
      console.log('error', error)
        this.setState({ loading: false });
        toast.error(
          error.message ? error.message.slice(0, 30) : "NFT unlisting failed"
        );
    }
  };

  changeTokenPrice = async (tokenId, newPrice) => {
    try {
      this.setState({ loading: true });
      this.setState({ text: 'Do not close this window while NFT price is being changed'})
      const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
      await this.state.DodNftContract.methods
        .changeTokenPrice(tokenId, newTokenPrice)
        .send({ from: this.state.accountAddress })
        .on('transactionHash', () => {  
          this.setState({ loading: false });
          // window.location.reload()
          toast.success(<div><h4 style={{ color: 'white', fontWeight:'600'}} >DOD NFT price change successfully</h4>. <p>Block confirmation could take a few minutes.</p> <p> Refresh marketplace in a few minutes to view newly updated NFT price</p></div>, {
              })
       })
    } catch (error) {
      console.log('error', error, error.message)
      this.setState({ loading: false });
      toast.error(
        error.message ? error.message.slice(0, 30) : "NFT price change failed"
      );
    }
  };

  buyDodNft = async (tokenId, price) => {
    this.setState({ loading: true });
    this.setState({ text: 'Do not close this window while NFT is being bought'})
     try {
       const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(this.state.accountAddress);
       const nftSwapSdk = new NftSwapV4(provider, signer, this.state.chainId);

      const payment_token = {
          tokenAddress: '0xe11a86849d99f524cac3e7a0ec1241828e332c62', // USDC contract address
          amount: price, // 69 USDC (USDC is 6 digits)
          type: 'ERC20',
        };

      const approvalStatusForUserB = await nftSwapSdk.loadApprovalStatus(
        payment_token,
        this.state.accountAddress
      );

      // If we do need to approve NFT for swapping, let's do that now
      if (!approvalStatusForUserB.contractApproved) {
        const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
          payment_token,
          this.state.accountAddress
        );
        const approvalTxReceipt = await approvalTx.wait();
        console.log(
          `Approved ${payment_token.tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`
        );
      }

      
       const order = await nftSwapSdk.getOrders({
            nftToken: this.state.contractAddress,
            nftTokenId: tokenId,
            sellOrBuyNft: "sell", // Only show asks (sells) for this NFT (excludes asks)
          });
        const foundOrder = order.orders[0];
        console.log(foundOrder)
        const fillTx = await nftSwapSdk.fillSignedOrder(foundOrder.order).then(async()=>{
          console.log('yes')
          await this.state.DodNftContract.methods
          .createMarketSale(tokenId)
          .send({ from: this.state.accountAddress })
          .on('transactionHash', () => {  
          this.setState({ loading: false });
           toast.success(<div><h4 style={{ color: 'white', fontWeight:'600'}}>DOD NFT purchase successfully</h4>. <p>Block confirmation could take a few minutes.</p> <p> Refresh marketplace in a few minutes to view newly purchased NFT</p></div>, {
              })
       })
      })
      const txReceipt = await fillTx.wait();
      console.log(txReceipt)
     } catch (error) {
      console.log(error)
      this.setState({ loading: false });
      toast.error(
        error.message ? error.message.slice(0, 30) : "NFT purchase failed"
      );
     }
      
  };

  render() {
    return (
      <div className="container">
          <Toaster
          position="top-right"
          reverseOrder={true}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
                success: {
                  duration: 5000,
                  style: {
                    color:'white',
                    background: 'green',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                     color:'white',
                    background: 'red',
                  },
                },
              }}
          >
             {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {/* {icon} */}
                {message}
                {t.type !== 'loading' && (
                  <button style={{border:'none', background:'transparent', borderRadius:'20px', color:'white'}}onClick={() => toast.dismiss(t.id)}>X</button>
                )}
              </>
            )}
    </ToastBar>
        )}
        </Toaster>;
        {!this.state.metamaskConnected ? (
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
        ) : !this.state.contractDetected ? (
          <ContractNotDeployed />
        ) : this.state.loading ? (
          <Loading text={this.state.text}/>
        ) : (
          <>
            <HashRouter basename="/">
              <Navbar />
              <Route
                path="/"
                exact
                render={() => (
                  <AccountDetails
                    accountAddress={this.state.accountAddress}
                    accountBalance={this.state.accountBalance}
                  />
                )}
              />
              <Route
                path="/mint"
                render={() => (
                  <FormAndPreview
                    mintMyNFT={this.mintMyNFT}
                    nameIsUsed={this.state.nameIsUsed}
                    setMintBtnTimer={this.setMintBtnTimer}
                  />
                )}
              />
              <Route
                path="/marketplace"
                render={() => (
                  <AllDodNfts
                    accountAddress={this.state.accountAddress}
                    DODnfts={this.state.DODnfts}
                    totalTokensMinted={this.state.totalTokensMinted}
                    changeTokenPrice={this.changeTokenPrice}
                    addForSale={this.addForSale}
                    removeFromSale={this.removeFromSale}
                    buyDodNft={this.buyDodNft}
                  />
                )}
              />
              <Route
                path="/my-tokens"
                render={() => (
                  <MyDodNfts
                    accountAddress={this.state.accountAddress}
                    DODnfts={this.state.DODnfts}
                    totalTokensOwnedByAccount={
                      this.state.totalTokensOwnedByAccount
                    }
                  />
                )}
              />
              <Route
                path="/queries"
                render={() => (
                  <Queries DodNftContract={this.state.DodNftContract} />
                )}
              />
            </HashRouter>
          </>
        )}
      </div>
    );
  }
}

export default App;

