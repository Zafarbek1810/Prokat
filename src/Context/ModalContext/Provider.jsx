import React, {useState} from 'react';
import ModalContext from "./Context";

const ModalContextProvider = ({ modalIsOpen, setIsOpen, children}) => {
  return (
    <ModalContext.Provider value={{
      modalIsOpen,
      setIsOpen,
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
