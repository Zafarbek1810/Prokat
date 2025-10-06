import React from 'react';
import {LoaderWrapper} from "./style";

const ButtonLoader = () => {
  return (
    <LoaderWrapper>
      <div className="lds-dual-ring">
        <div className="lds-dual-ring2"/>
      </div>
    </LoaderWrapper>
  );
};

export default ButtonLoader;
