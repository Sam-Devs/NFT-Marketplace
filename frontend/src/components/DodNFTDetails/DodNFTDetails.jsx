import React, { Component } from "react";

class DodNFTDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newDodNftPrice: "",
    };
  }

  callChangeTokenPriceFromApp = (tokenId, newPrice) => {
    this.props.changeTokenPrice(tokenId, newPrice);
  };

  render() {
    return (
      <div key={this.props.dodNft.tokenId.toNumber()} className="mt-4">
        <p>
          <span className="font-weight-bold">Token Id</span> :{" "}
          {this.props.dodNft.tokenId.toNumber()}
        </p>
        <p>
          <span className="font-weight-bold">Name</span> :{" "}
          {this.props.dodNft.tokenName}
        </p>
        <p>
          <span className="font-weight-bold">Minted By</span> :{" "}
          {this.props.dodNft.mintedBy.substr(0, 5) +
            "..." +
            this.props.dodNft.mintedBy.slice(
              this.props.dodNft.mintedBy.length - 5
            )}
        </p>
        <p>
          <span className="font-weight-bold">Owned By</span> :{" "}
          {this.props.dodNft.currentOwner.substr(0, 5) +
            "..." +
            this.props.dodNft.currentOwner.slice(
              this.props.dodNft.currentOwner.length - 5
            )}
        </p>
         <p>
          <span className="font-weight-bold">Previous Owner</span> :{" "}
          {this.props.dodNft.previousOwner.substr(0, 5) +
            "..." +
            this.props.dodNft.previousOwner.slice(
              this.props.dodNft.previousOwner.length - 5
            )}
        </p> 
         <p>
          <span className="font-weight-bold">Price</span> :{" "}
          {window.web3.utils.fromWei(
            this.props.dodNft.price.toString(),
            "Ether"
          )}{" "}
          USDC Ξ
        </p> 
        <p>
          <span className="font-weight-bold">No. of Transfers</span> :{" "}
          {this.props.dodNft.numberOfTransfers.toNumber()}
        </p>
        <div>
          {this.props.accountAddress === this.props.dodNft.currentOwner && !this.props.dodNft.listed ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.callChangeTokenPriceFromApp(
                  this.props.dodNft.tokenId.toNumber(),
                  this.state.newDodNftPrice
                );
              }}
            >
              <div className="form-group mt-4 ">
                <label htmlFor="newDodNftPrice">
                  <span className="font-weight-bold">Change Token Price</span> :
                </label>{" "}
                <input
                  required
                  type="number"
                  name="newDodNftPrice"
                  id="newDodNftPrice"
                  value={this.state.newDodNftPrice}
                  className="form-control w-50"
                  placeholder="Enter new price"
                  onChange={(e) =>
                    this.setState({
                      newDodNftPrice: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                className="btn btn-outline-info mt-0 w-50"
              >
                change price
              </button>
            </form>
          ) : null}
        </div>
        <div>
          {this.props.accountAddress === this.props.dodNft.currentOwner ? (
            this.props.dodNft.listed ? (
              <button
                className="btn btn-outline-danger mt-4 w-50"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={() =>
                  this.props.removeFromSale(
                    this.props.dodNft.tokenId.toNumber()
                  )
                }
              >
                Remove from sale
              </button>
            ) : (
              <button
                className="btn btn-outline-success mt-4 w-50"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={() =>
                  this.props.addForSale(
                    this.props.dodNft.tokenId.toNumber(),
                    this.props.dodNft.price
                  )
                }
              >
                Keep for sale
              </button>
            )
          ) : null}
        </div>
        <div>
          {this.props.accountAddress !== this.props.dodNft.currentOwner ? (
            this.props.dodNft.listed ? (
              <button
                className="btn btn-outline-primary mt-3 w-50"
                value={this.props.dodNft.price}
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={(e) =>
                  this.props.buyDodNft(
                    this.props.dodNft.tokenId.toNumber(),
                    e.target.value
                  )
                }
              >
                Buy For{" "}
                {window.web3.utils.fromWei(
                  this.props.dodNft.price.toString(),
                  "Ether"
                )}{" "}
                USDC
              </button>
            ) : (
              <>
                {/* <button
                  disabled
                  style={{ fontSize: "0.8rem", letterSpacing: "0.14rem", color:'#919aa1', borderColor: "#919aa1" }}
                  className="btn btn-outline-primary mt-3 w-50"
                >
                  Buy For{" "}
                  {window.web3.utils.fromWei(
                    this.props.dodNft.price.toString(),
                    "Ether"
                  )}{" "}
                  USDC
                </button> */}
                <p className="mt-2" style={{color:'blue', fontSize:'16px', fontWeight:'bold'}}>Currently not for sale!</p>
              </>
            )
          ) : null}
        </div>
      </div>
    );
  }
}

export default DodNFTDetails;
