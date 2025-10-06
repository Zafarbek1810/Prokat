import styled from "styled-components";

export const SidebarWrapper = styled.div`
  height: 100%;
  padding: 20px 0;
  background: #ffffff;

  .sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 16px;

    .link, .activelink {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      text-decoration: none;
      color: #64748b;
      border-radius: 8px;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      font-weight: 500;
      font-size: 14px;
      background: transparent;
      border: none;

      &:hover {
        background: #f1f5f9;
        color: #334155;
        transform: translateX(2px);
      }

      img {
        width: 18px;
        height: 18px;
        filter: brightness(0.7);
        transition: all 0.2s ease;
      }

      span {
        transition: all 0.2s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &:hover {
        img {
          filter: brightness(0.9);
        }
      }

      &.activelink {
        background: #3b82f6;
        color: white;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

        img {
          filter: brightness(0) invert(1);
        }

        &:hover {
          background: #2563eb;
          transform: translateX(2px);
        }
      }
    }

    /* Badge styling */
    .ant-badge {
      .ant-badge-count {
        background: #ef4444;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        font-weight: bold;
        animation: pulse 2s infinite;
      }
    }

    /* Category separators */
    .category-separator {
      margin: 16px 0 8px 0;
      padding: 0 16px;
      
      .separator-line {
        height: 1px;
        background: #e2e8f0;
        border-radius: 1px;
      }
      
      .category-title {
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        padding: 0 4px;
      }
    }

    /* Scrollbar styling */
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f8fafc;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
      
      &:hover {
        background: #94a3b8;
      }
    }
  }

  /* Pulse animation for badges */
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .sidebar-menu {
      padding: 0 12px;
      gap: 2px;

      .link, .activelink {
        padding: 10px 12px;
        font-size: 13px;
        gap: 10px;

        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  /* Collapsed sidebar styles */
  &.collapsed {
    .sidebar-menu {
      .link, .activelink {
        padding: 12px;
        justify-content: center;

        span {
          display: none;
        }

        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  /* Glass morphism effect for mobile */
  @media (max-width: 768px) {
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
  }
`;
