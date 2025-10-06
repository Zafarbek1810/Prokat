import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh !important;
  background: #f8fafc;
  
  .layout__top {
    flex-shrink: 0;
    border-bottom: 1px solid #e2e8f0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    z-index: 1000;
    transition: all 0.3s ease;
  }

  .layout_bottom {
    display: flex;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    height: calc(100vh - 70px) !important;
    overflow-y: auto;
    
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    &::-webkit-scrollbar {
      width: 8px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
      &:hover {
        background: #94a3b8;
      }
    }
  }

  .layout__sidebar {
    flex-shrink: 0;
    width: 280px;
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
    overflow-y: auto;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    }

    &::-webkit-scrollbar-track {
      background: #f8fafc;
      border-radius: 10px;
    }
    &::-webkit-scrollbar {
      width: 6px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
      
      &:hover {
        background: #94a3b8;
      }
    }
  }

  .layout__main {
    height: calc(100vh - 90px);
    padding: 30px;
    background: #f8fafc;
  }

  .layout__right {
    flex-grow: 1;
    overflow-y: auto;
    background: #f8fafc;
    
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    &::-webkit-scrollbar {
      width: 8px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
      &:hover {
        background: #94a3b8;
      }
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .layout__sidebar {
      width: 100%;
      position: fixed;
      left: -100%;
      z-index: 999;
      
      &.open {
        left: 0;
      }
    }
    
    .layout__main {
      padding: 20px;
    }
  }

  /* Animation for sidebar toggle */
  .layout__sidebar.collapsed {
    width: 80px;
    
    .sidebar-menu {
      .link, .activelink {
        span {
          opacity: 0;
          transform: translateX(-20px);
        }
      }
    }
  }

  /* Glass morphism effect */
  .glass-effect {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
  }
`;

export { Wrapper };
