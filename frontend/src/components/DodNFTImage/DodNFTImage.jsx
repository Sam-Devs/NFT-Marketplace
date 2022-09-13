import React from "react";

const DodNFTImage = ({ imgUrl }) => {
 

 

  return (
    <div>
      <img src={imgUrl} alt="" style={{ width: "15rem", height:"15rem", objectFit:'cover', padding:'10px', border:'1px solid #ced4da' }} />
    </div>
  );
};

export default DodNFTImage;
