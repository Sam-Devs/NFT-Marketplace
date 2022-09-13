import React, { Component } from "react";

// source: https://stackoverflow.com/questions/1484506/random-color-generator


class FormAndPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dodName: "",
      dodPrice: "",
      imgDoc: null,
      src: ""
    };
  }

  componentDidMount = async () => {
    await this.props.setMintBtnTimer();
  };

  callMintMyNFTFromApp = (e) => {
    e.preventDefault();
    this.props.mintMyNFT(
      this.state.dodName,
      this.state.dodPrice,
      this.state.imgDoc,
      this.state.src
    );
  };

setImg =(e) => {
      this.setState({
        imgDoc: e.target.files[0]
      });
      console.log('this.state.imgDoc', this.state.imgDoc)
       const objectUrl = URL.createObjectURL(e.target.files[0])
        this.setState({
              src: objectUrl
            });
   return () => URL.revokeObjectURL(objectUrl)
}

  render() {
    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>Upload your image and mint to become a  DOD NFT for free </h5>
          </div>
        </div>
        <form onSubmit={this.callMintMyNFTFromApp} className="pt-4 mt-1">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                {!this.state.src? <label htmlFor="Dodname">Select a picture to upload</label>: ''}
                {this.state.src? <img src={this.state.src} style={{ width: "2rem" }} className="w-100 p-2 mt-1 border" alt=""/>: ''}
                <input
                  required
                  type="file"
                  name="imageUpload"
                  id="imageUpload"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => this.setImg(e)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="Dodname">Name</label>
                <input
                  required
                  type="text"
                  value={this.state.dodName}
                  className="form-control"
                  placeholder="Enter Your Dod Nft's Name"
                  onChange={(e) =>
                    this.setState({ dodName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="price">Price (USDC)</label>
                <input
                  required
                  type="number"
                  name="price"
                  id="dodPrice"
                  value={this.state.dodPrice}
                  className="form-control"
                  placeholder="Enter Price In USDCΞ"
                  onChange={(e) =>
                    this.setState({ dodPrice: e.target.value })
                  }
                />
              </div>
              <button
                id="mintBtn"
                style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                type="submit"
                className="btn mt-4 btn-block btn-outline-primary"
                disabled={!this.state.dodPrice || !this.state.dodName || !this.state.src}
              >
                Mint My DOD NFT
              </button>
              <div className="mt-4">
                {this.props.nameIsUsed ? (
                  <div className="alert alert-danger alert-dissmissible">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                    >
                      <span>&times;</span>
                    </button>
                    <strong>This name is taken!</strong>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormAndPreview;
