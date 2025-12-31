import React, { useEffect, useState } from "react";
import { DashboardHeaderWrapper } from "./DashboardHeader.style";
import Container from "../../Common/Container";
import { useContextSelector } from "use-context-selector";
import UserContext from "../../../Context/UserContext";
import { useRouter } from "next/router";
import LogOutSvg from "../../Common/Svgs/LogOutSvg";
import MyLink from "../../Common/MyLink";
import BellSvg from "../../Common/Svgs/BellSvg";
import { Dropdown, Menu } from "antd";
import EnvelopeSvg from "../../Common/Svgs/EnvelopeSvg";

export const LINKS = [
  {
    name: "Menu",
    path: "/dashboard/homeDashboard",
    id: 1,
  },
  {
    name: "Menu",
    path: "/dashboard/dash",
    id: 2,
  },
  {
    name: "Menu",
    path: "/",
    id: 3,
  },
  {
    name: "Menu",
    path: "/",
    id: 4,
  },
  {
    name: "Menus",
    path: "/",
    dropMenu: [
      {
        title: "Item 1",
        path: "/",
        id: 2.1,
      },
      {
        title: "Item 2",
        path: "/",
        id: 2.2,
      },
      {
        title: "Item 3",
        path: "/",
        id: 2.3,
      },
    ],
    id: 2,
  },
];

const DashboardHeader = ({ RefObj, setIsOpen, setOpen, onMenuToggle }) => {
  const logoutContext = useContextSelector(
    UserContext,
    (ctx) => ctx.actions.logout
  );
  const router = useRouter();

  const [name, setName] = useState([]);
  const [message, setMessage] = useState([]);
  const [smsCount, setSmsCount] = useState(null);

  const handleOpen = () => {
    if (onMenuToggle) {
      onMenuToggle();
    } else {
      setOpen((p) => !p);
    }
  };

  const handleLogout = () => {
    RefObj.current.textContent = `Haqiqatan ham tizimdan chiqmoqchimisiz?`;
    setIsOpen(true);
    new Promise((res, rej) => {
      RefObj.current.resolve = res;
      RefObj.current.reject = rej;
    })
      .then(() => {
        logoutContext();
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const items = [
    ...message.map((i) => ({
      label: i.message,
      key: i.id,
    })),
  ];

  return (
    <DashboardHeaderWrapper>
      <div className="top">
        <div className="wrap">
          <div className="left">
            <MyLink to={"/"} className="logo">
              <img src="/icons/logo.svg" alt="Logo" />
            </MyLink>
            <div className="menu-toggle" onClick={handleOpen}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span className="brand-name">Prokat Uz</span>
          </div>
          <div className="right">
            <div className="notification-btn">
              <BellSvg />
              {smsCount > 0 && <span className="badge">{smsCount}</span>}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <span>Chiqish</span>
              <LogOutSvg />
            </button>
          </div>
        </div>
      </div>
    </DashboardHeaderWrapper>
  );
};

export default DashboardHeader;
