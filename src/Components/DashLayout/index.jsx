import React, { useState } from "react";
import { activate } from "./dash";
import { useEffect } from "react";
import Script from "next/script";
import LogOutSvg from "../Common/Svgs/LogOutSvg";
import { useRouter } from "next/router";
import { useContextSelector } from "use-context-selector";
import UserContext from "../../Context/UserContext";
import MyLink from "../Common/MyLink";
import { Modal, Collapse } from "antd";
import styled from "styled-components";
import AuthProvider from "../../Data/AuthProvider";
import ListingProvider from "../../Data/ListingProvider";
// LanguageSwitcher and i18n removed for static export

const { Panel } = Collapse;

const Style = styled.div`
  .ant-collapse-header {
    padding: 0 !important;
    margin-bottom: 10px;
    padding-left: 15px !important;
    display: flex;
    flex-direction: row-reverse;
  }
  .ant-collapse-header-text {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ant-collapse-content-box {
    padding: 0 !important;
    margin-bottom: 10px;
    padding-left: 10px !important;
  }
  .li-active::before {
    content: "";
    background-color: blue;
    position: absolute;
    height: 36px;
    width: 225px;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    opacity: 0.8;
    left: 0px;
    z-index: -1;
    transition: all 400ms ease;
  }
  .li-active span,
  .li-active i {
    color: white !important;
  }
  .menu-toggle {
    width: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin-right: 12px;
  }
  .menu-toggle div {
    width: 24px;
    height: 1px;
    background: #47404f;
    margin: 3px 0;
  }
  li,
  .ant-collapse-header-text {
    font-weight: 600;
  }
`;

const DashLayout = ({ children }) => {
  // Static Russian texts
  const logoutContext = useContextSelector(
    UserContext,
    (ctx) => ctx.actions.logout
  );
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [me, setMe] = useState({});
  const [activeAdsCount, setActiveAdsCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      activate();
    }
  }, []);

  useEffect(() => {
    AuthProvider.getMe()
      .then((res) => {
        setMe(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // Fetch count of active listings for the sidebar badge
    ListingProvider.getAllListing('', 'pending', 1, '', '')
      .then((res) => {
        const data = res?.data;
        const count = (typeof data?.count === 'number' && data.count)
          || (typeof data?.total === 'number' && data.total)
          || (Array.isArray(data?.results) && data.results.length)
          || (Array.isArray(data) && data.length)
          || 0;
        setActiveAdsCount(count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLogout = () => {
    logoutContext();
    router.push("/login");
  };

  const closeSidebarFull = () => {
    const $appAdminWrap = document.querySelector(".app-admin-wrap");
    if ($appAdminWrap) {
      $appAdminWrap.classList.add("sidebar-closed");
      $appAdminWrap.classList.remove("sidebar-full");
    }
  };

  const openSidebarCompact = () => {
    const $appAdminWrap = document.querySelector(".app-admin-wrap");
    if ($appAdminWrap) {
      $appAdminWrap.classList.add("sidebar-compact");
    }
  };

  const closeSidebarCompact = () => {
    const $appAdminWrap = document.querySelector(".app-admin-wrap");
    if ($appAdminWrap) {
      $appAdminWrap.classList.remove("sidebar-compact");
    }
  };

  const openSidebarFull = () => {
    const $appAdminWrap = document.querySelector(".app-admin-wrap");
    if ($appAdminWrap) {
      $appAdminWrap.classList.remove("sidebar-closed");
      $appAdminWrap.classList.add("sidebar-full");
    }
  };

  const changeHeadToggle = () => {
    if (isSidebarOpen) {
      closeSidebarFull();
      openSidebarCompact();
    } else {
      closeSidebarCompact();
      openSidebarFull();
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  const links = [
    {
      name: 'Панель',
      path: "/dashboard",
      icon: <i class="i-Bar-Chart text-20 mr-2 text-muted"></i>,
    },
    {
      name: 'Администраторы',
      path: "/admins",
      icon: <i className="i-Administrator text-20 mr-2 text-muted"></i>,
    },
    {
      name: 'Объявления',
      path: "/ads",
      icon: <i class="nav-icon i-Letter-Open"></i>,
    },
    {
      name: 'Арендовано',
      path: "/booking",
      icon: <i class="nav-icon i-Letter-Open"></i>,
    },
    {
      name: 'Отчет',
      path: "/report",
      icon: <i className="i-Monitor-Analytics text-20 mr-2 text-muted"></i>,
    },
    {
      name: 'Категории',
      path: "/listing-category",
      icon: <i className="i-Library text-20 mr-2 text-muted"></i>,
    },
    // {
    //   name: "E'lonlar",
    //   icon: <i class="nav-icon i-Letter-Open"></i>,
    //   children: [
    //     {
    //       name: "E'lonlar",
    //       path: "/ads",
    //       icon: <i class="nav-icon i-Letter-Open"></i>,
    //     },
    //     {
    //       name: "E'lonlar kategoriyasi",
    //       path: "/listing-category",
    //       icon: <i className="i-Library text-20 mr-2 text-muted"></i>,
    //     },
    //   ],
    // },
    // {
    //   name: "Kategoriya",
    //   path: "/category",
    //   icon: <i className="i-Library text-20 mr-2 text-muted"></i>,
    // },
    {
      name: 'Состояния',
      path: "/conditions",
      icon: <i className="i-Receipt-4 text-20 mr-2 text-muted"></i>,
    },
    {
      name: 'Пользователи',
      path: "/users",
      icon: <i className="i-Administrator text-20 mr-2 text-muted"></i>,
    },
    {
      name: 'Чаты',
      path: "/chat",
      icon: <i className="i-Speach-Bubble-3 text-20 mr-2 text-muted"></i>,
    },
    {
      name: 'Обновление версии',
      path: "/version",
      icon: <i className="i-Refresh text-20 mr-2 text-muted"></i>,
    },
  ];

  return (
    <Style>
      <div className="app-admin-wrap  layout-sidebar-vertical sidebar-full">
        <div className="sidebar-panel bg-white">
          <div className="gull-brand pr-3 text-center mt-4 mb-2 d-flex  align-items-center justify-content-center">
            {/* <img className="mb-3" src="/images/logo1.png" alt="alt" /> */}
            <img style={{ width: '100px' }} src="/icons/logo.svg" alt="" />
          </div>
          <div className="scroll-nav ps ps--active-y">
            <div className="side-nav">
              <div className="main-menu">
                <ul className="metismenu" id="menu">
                  {links.map((link, index) => {
                    if (link.children) {
                      return (
                        <Collapse ghost>
                          <Panel
                            header={
                              <>
                                {link.icon}
                                <span className="item-name text-15 text-muted">
                                  {link.name}
                                </span>
                              </>
                            }
                            key={index}
                          >
                            {link.children.map((child, childIndex) => (
                              <li
                                className={`Ul_li--hover ${child.path === router.pathname
                                    ? "li-active"
                                    : ""
                                  }`}
                                key={childIndex}
                              >
                                <MyLink to={child.path}>
                                  {child.icon}
                                  <span className="item-name text-15 text-muted">
                                    {child.name}
                                  </span>
                                </MyLink>
                              </li>
                            ))}
                          </Panel>
                        </Collapse>
                      );
                    } else {
                      return (
                        <li
                          className={`Ul_li--hover ${link.path === router.pathname ? "li-active" : ""
                            }`}
                          key={index}
                        >
                          <MyLink to={link.path}>
                            {link.icon}
                            <span className="item-name text-15 text-muted">
                              {link.name}
                            </span>
                            {link.path === "/ads" && (
                              <span
                                className="badge badge-success ml-2"
                                style={{ borderRadius: 12 }}
                              >
                                {activeAdsCount}
                              </span>
                            )}
                          </MyLink>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="switch-overlay" style={{ pointerEvents: 'none' }}></div>
        <div className="main-content-wrap mobile-menu-content bg-off-white m-0">
          <header className="main-header bg-white d-flex justify-content-between p-2">
            <div className="header-toggle" onClick={(e) => changeHeadToggle(e)}>
              <div className="menu-toggle ">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="header-part-right d-flex align-items-center gap-3">
              <h3>{me.username}</h3>
              {/* Language switcher removed */}
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => setIsOpen(true)}
              >
                <LogOutSvg />
              </button>
            </div>
          </header>
          <div className="sidebar-overlay" style={{ pointerEvents: 'none' }}></div>
          <div className="main-content pt-4">{children}</div>

          <div className="flex-grow-1"></div>
        </div>
      </div>

      <Modal
        title={'Выйти из системы'}
        width={450}
        centered
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
      >
        <p>{'Вы действительно хотите выйти из системы?'}</p>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            {'Назад'}
          </button>
          <button
            className="btn btn-primary ml-2"
            onClick={handleLogout}
            type="button"
          >
            {'Выйти'}
          </button>
        </div>
      </Modal>

      <Script src="../assets/js/plugins/jquery-3.3.1.min.js"></Script>
      <Script src="../assets/js/plugins/bootstrap.bundle.min.js"></Script>
      <Script src="../assets/js/plugins/perfect-scrollbar.min.js"></Script>
      <Script src="../assets/js/scripts/script.min.js"></Script>
      <Script src="../assets/js/scripts/sidebar.compact.script.min.js"></Script>
      <Script src="../assets/js/scripts/customizer.script.min.js"></Script>
      <Script src="../assets/js/plugins/apexcharts.min.js"></Script>
      <Script src="../assets/js/scripts/echart.options.min.js"></Script>
      <Script src="../assets/js/scripts/dashboard.v3.script.min.js"></Script>
      <Script src="../assets/js/scripts/card.metrics.script.min.js"></Script>
      <Script src="../assets/js/scripts/widgets-statistics.min.js"></Script>
      <Script src="../assets/js/scripts/apexColumnChart.script.min.js"></Script>
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
        crossorigin="anonymous"
      ></Script>
    </Style>
  );
};

export default DashLayout;
