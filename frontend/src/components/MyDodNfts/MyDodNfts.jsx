import React, { useState, useEffect } from "react";
import DodNFTImage from "../DodNFTImage/DodNFTImage";
import MyDodNFTDetails from "../MyDodNFTDetails/MyDodNFTDetails";
import Loading from "../Loading/Loading";

const MyDodNfts = ({
  accountAddress,
  DODnfts,
  totalTokensOwnedByAccount,
}) => {
  const [loading, setLoading] = useState(false);
  const [myDodNfts, setMyDodNfts] = useState([]);

  useEffect(() => {
    const my_dods = DODnfts.filter(
      (dod) => dod.currentOwner === accountAddress
    );
    setMyDodNfts(my_dods);
  }, [DODnfts]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of DODs You Own : {totalTokensOwnedByAccount}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {myDodNfts.map((dod) => {
          return (
            <div
              key={dod.tokenId.toNumber()}
              className="w-50 p-4 mt-1 border"
            >
              <div className="row">
                <div className="col-md-6">
                  {!loading ? (
                    <DodNFTImage
                     imgUrl={dod.src}
                    />
                  ) : (
                    <Loading />
                  )}
                </div>
                <div className="col-md-6 text-center">
                  <MyDodNFTDetails
                    dod={dod}
                    accountAddress={accountAddress}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyDodNfts;
