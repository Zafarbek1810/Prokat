import React from 'react';
import {LoaderWrapper} from "./style";

const MinLoader = () => {
  return (
    <div style={{textAlign: "center"}}>
      <LoaderWrapper>
        <div className="lds-dual-ring">
          <div className="lds-dual-ring2"/>
        </div>
      </LoaderWrapper>
    </div>
  );
};

export default MinLoader;
