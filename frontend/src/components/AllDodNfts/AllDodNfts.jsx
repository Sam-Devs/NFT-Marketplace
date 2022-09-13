import React, { useState, useEffect } from "react";
import DodNFTImage from "../DodNFTImage/DodNFTImage";
import DodNFTDetails from "../DodNFTDetails/DodNFTDetails";
import Loading from "../Loading/Loading";

const AllDodNfts = ({
  DODnfts,
  accountAddress,
  totalTokensMinted,
  changeTokenPrice,
  addForSale,
  buyDodNft,
  removeFromSale
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (DODnfts.length !== 0) {
      if (DODnfts[0].metaData !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
  }, [DODnfts]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Dod Nfts Minted On The Platform :{" "}
            {totalTokensMinted}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {DODnfts.map((dodNft) => {
          return (
            <div key={dodNft.tokenId.toNumber()}  className="w-50 p-4 mt-1 border">
            {dodNft.tokenId.toNumber() !== 0 ? <div
             
            >
              {!loading ? (
                <DodNFTImage
                imgUrl={dodNft.src}
                />
              ) : (
                <Loading />
              )}
              <DodNFTDetails
                dodNft={dodNft}
                accountAddress={accountAddress}
                changeTokenPrice={changeTokenPrice}
                addForSale={addForSale}
                buyDodNft={buyDodNft}
                removeFromSale={removeFromSale}
              />
            </div>: ''}
          </div>);
        })}
      </div>
    </div>
  );
};

export default AllDodNfts;
