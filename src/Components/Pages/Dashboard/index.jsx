import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PieChart from "./PieChart";
import PieChart2 from "./PieChart2";
import ClientsDash from "./ClientsDash";
import AdminProvider from "../../../Data/AdminProvider";
import BasicAreaChart from "./BasicAreaChart";

const DashboardWrapper = styled.div`
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
  }

  .dashboard-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '';
        width: 3px;
        height: 16px;
        background: #3b82f6;
        border-radius: 2px;
      }
    }

    .card-content {
      // min-height: 350px;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .stat-number {
      font-size: 28px;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 6px;
    }

    .stat-label {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .dashboard-card {
      padding: 20px;

      .card-title {
        font-size: 15px;
      }
    }

    .stat-card {
      padding: 16px;

      .stat-number {
        font-size: 24px;
      }

      .stat-label {
        font-size: 12px;
      }
    }
  }
`;

const Dashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    AdminProvider.statistics()
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <DashboardWrapper>
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{data?.listings?.total || 0}</div>
          <div className="stat-label">ВСЕГО ОБЪЯВЛЕНИЙ</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data?.listings?.new || 0}</div>
          <div className="stat-label">НОВЫЕ ОБЪЯВЛЕНИЯ</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data?.listings?.active || 0}</div>
          <div className="stat-label">АКТИВНЫЕ ОБЪЯВЛЕНИЯ</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data?.listings?.pending || 0}</div>
          <div className="stat-label">ОЖИДАЮТ</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-title">Количество объявлений</div>
          <div className="card-content">
            <PieChart />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">Количество объявлений по категориям</div>
          <div className="card-content">
            <PieChart2 />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">Количество объявлений по категориям</div>
          <div className="card-content">
            <BasicAreaChart />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">Количество объявлений по категориям</div>
          <div className="card-content">
            <ClientsDash />
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Dashboard;
