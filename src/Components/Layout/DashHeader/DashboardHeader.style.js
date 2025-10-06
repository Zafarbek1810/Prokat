import styled from "styled-components";

export const DashboardHeaderWrapper = styled.div`
  .top {
    padding: 0 30px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;

    .wrap {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        display: flex;
        align-items: center;
        gap: 30px;

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;

          img {
            height: 35px;
            width: auto;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            transition: all 0.3s ease;

            &:hover {
              transform: scale(1.05);
              filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
            }
          }
        }

        .brand-name {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: 0.5px;
          margin-left: 10px;
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
          background: #f1f5f9;

          &:hover {
            background: #e2e8f0;
            transform: scale(1.05);
          }

          div {
            width: 20px;
            height: 2px;
            background: #475569;
            border-radius: 1px;
            transition: all 0.3s ease;
          }

          &:hover div {
            background: #334155;
          }
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }
          
          .brand-name {
            display: none;
          }
        }
      }

      .right {
        display: flex;
        align-items: center;
        gap: 20px;

        h3 {
          margin: 0;
          color: #334155;
          font-weight: 600;
          font-size: 16px;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            background: #2563eb;
          }

          &:active {
            transform: translateY(0);
          }

          svg {
            width: 16px;
            height: 16px;
            transition: all 0.3s ease;
          }

          &:hover svg {
            transform: rotate(180deg);
          }

          span {
            font-weight: 500;
          }
        }

        .notification-btn {
          position: relative;
          padding: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: #f1f5f9;
            transform: scale(1.05);
          }

          svg {
            width: 18px;
            height: 18px;
            color: #64748b;
            transition: all 0.3s ease;
          }

          &:hover svg {
            color: #475569;
          }

          .badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #ef4444;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
            animation: pulse 2s infinite;
          }
        }
      }
    }
  }

  /* Pulse animation for notification badge */
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .top {
      padding: 0 20px;

      .wrap {
        .left {
          gap: 20px;
        }

        .right {
          gap: 15px;

          h3 {
            display: none;
          }

          .logout-btn {
            padding: 8px 12px;
            font-size: 13px;
            
            span {
              display: none;
            }
          }
        }
      }
    }
  }
`;
