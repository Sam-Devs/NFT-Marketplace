import React from "react";
import loadingGIF from "./loading.gif";

const Loading = ({text}) => {
  return( 
    <>
  <img src={loadingGIF} alt="Loading.." className="d-block m-auto" />
  <h4 style={{textAlign:'center'}}> {text || 'Loading ...'} </h4>
  </>);
};

export default Loading;
