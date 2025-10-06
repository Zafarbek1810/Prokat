import React, { useRef, useState } from "react";
import DashboardHeader from "./DashHeader";
import Sidebar from "./Sidebar";
import { Wrapper } from "./style";
import { ModalContextProvider } from "../../Context/ModalContext";
import ConfirmModal from "../Common/ConfirmModal";

const DashboardLayout = ({ children }) => {
  const RefObj = useRef({ resolve() {}, reject() {} });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setOpen((prev) => !prev);
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <>
      <Wrapper>
        <div className="layout__top">
          <DashboardHeader 
            RefObj={RefObj} 
            setIsOpen={setIsOpen} 
            setOpen={setOpen}
            onMenuToggle={handleSidebarToggle}
          />
        </div>
        <div className="layout_bottom">
          <div 
            className={`layout__sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${open ? 'open' : ''}`}
            style={!open ? {width: sidebarCollapsed ? 80 : 280} : {width: 0}}
          >
            <Sidebar />
          </div>
          <div className="layout__right">
            <main className="layout__main">
              {children}
            </main>
          </div>
        </div>
      </Wrapper>
      <ModalContextProvider
        RefObj={RefObj}
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
      >
        <ConfirmModal>{RefObj.current.textContent}</ConfirmModal>
      </ModalContextProvider>
    </>
  );
};

export default DashboardLayout;
