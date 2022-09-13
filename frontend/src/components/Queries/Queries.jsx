import React, { useState } from "react";

const Queries = (props) => {
  const [tokenIdForOwner, setTokenIdForOwner] = useState("");
  const [tokenOwner, setTokenOwner] = useState("");
  const [tokenIdForOwnerNotFound, setTokenIdForOwnerNotFound] = useState(false);


  const getTokenOwner = async (e) => {
    e.preventDefault();
    try {
      const owner = await props.DodNftContract.methods
        .oneDod(tokenIdForOwner)
        .call();
        if (owner.currentOwner === '0x0000000000000000000000000000000000000000')setTokenIdForOwnerNotFound(true);
       else setTokenOwner(owner.currentOwner);
      setTimeout(() => {
        setTokenOwner("");
        setTokenIdForOwner("");
      }, 5000);
    } catch (e) {
      setTokenIdForOwnerNotFound(true);
      setTokenIdForOwner("");
    }
  };


  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>Queries</h5>
        </div>
      </div>
      <div className="p-4 border d-grid grid-cols-2 gap-4">
        <div className="row w-100">
          <div className="col-md-5">
            <h5>Get Token Owner</h5>
            <form onSubmit={getTokenOwner}>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={tokenIdForOwner}
                  placeholder="Enter Token Id"
                  onChange={(e) => setTokenIdForOwner(e.target.value)}
                />
              </div>
              <button className="mt-3 btn btn-outline-primary" type="submit">
                Get Owner
              </button>
              {tokenIdForOwnerNotFound ? (
                <div className="alert alert-danger alert-dissmissible mt-4">
                  <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                  </button>
                  <strong>Non-Existent Token Id</strong>
                </div>
              ) : null}
            </form>
            <p className="mt-4">{tokenOwner}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queries;
