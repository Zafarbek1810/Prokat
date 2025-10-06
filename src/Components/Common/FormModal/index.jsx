import React, { useContext, useState } from "react";
import ModalContext from "../../../Context/ModalContext";
import { Modal } from "antd";

const FormModal = ({ children, title, width }) => {
  const { setIsOpen, modalIsOpen } = useContext(ModalContext);

  return (
    <Modal
      title={title}
      width={width}
      open={modalIsOpen}
      onCancel={()=>setIsOpen(false)}
      footer={null}
      centered
    >
      <p>{children}</p>
    </Modal>
  );
};

export default FormModal;
