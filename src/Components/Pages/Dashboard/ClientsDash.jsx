import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AdminProvider from "../../../Data/AdminProvider";

const ClientsDashWrapper = styled.div`
  .table-container {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
  }

  .table-header {
    background: #3b82f6;
    color: white;
    padding: 16px 20px;
    text-align: center;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  .table-responsive {
    overflow-x: auto;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
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

  .table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
    
    thead {
      background: #f8fafc;
      
      th {
        padding: 12px 16px;
        text-align: center;
        font-weight: 600;
        color: #374151;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #e5e7eb;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: #3b82f6;
          transition: width 0.2s ease;
        }
        
        &:hover::after {
          width: 80%;
        }
      }
    }
    
    tbody {
      tr {
        transition: all 0.2s ease;
        border-bottom: 1px solid #f3f4f6;
        
        &:hover {
          background: #f9fafb;
          transform: scale(1.005);
        }
        
        &:last-child {
          border-bottom: none;
        }
        
        th, td {
          padding: 12px 16px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        
        th {
          background: #f8fafc;
          color: #3b82f6;
          font-weight: 600;
          border-radius: 6px 0 0 6px;
        }
        
        td {
          &:nth-child(2) {
            font-weight: 600;
            color: #374151;
          }
          
          &:nth-child(3),
          &:nth-child(4) {
            font-weight: 600;
            color: #3b82f6;
          }
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 15px;
      opacity: 0.5;
    }
    
    .empty-text {
      font-size: 16px;
      font-weight: 500;
    }
  }

  @media (max-width: 768px) {
    .table-header {
      padding: 12px 16px;
      
      h3 {
        font-size: 15px;
      }
    }
    
    .table {
      thead th {
        padding: 10px 12px;
        font-size: 12px;
      }
      
      tbody th, tbody td {
        padding: 10px 12px;
        font-size: 13px;
      }
    }
  }
`;

const ClientsDash = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminProvider.statistics()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ClientsDashWrapper>
        <div className="empty-state">
          <div className="empty-text">Ma'lumotlar yuklanmoqda...</div>
        </div>
      </ClientsDashWrapper>
    );
  }

  return (
    <ClientsDashWrapper>
      <div className="table-container">
        <div className="table-header">
          <h3>Kategoriyalar bo'yicha e'lonlar soni</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Kategoriya nomi</th>
                <th scope="col">E'lonlar soni</th>
                <th scope="col">Bron qilingan soni</th>
              </tr>
            </thead>
            <tbody>
              {data?.popular_categories?.length > 0 ? (
                data.popular_categories.map((v, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{v?.name}</td>
                    <td>{v?.listing_count}</td>
                    <td>{v?.booking_count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <div className="empty-text">Ma'lumotlar mavjud emas</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ClientsDashWrapper>
  );
};

export default ClientsDash;
