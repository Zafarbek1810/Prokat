import styled from "styled-components";

const TableStyleWrapper = styled.div`
.table__wrapper{
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;

  .table__responsive{
    width: 100%;
    overflow-x: auto;
    &::-webkit-scrollbar-track
    {
      box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
      border-radius: 10px;
      background-color: #f8f9fa;
    }

    &::-webkit-scrollbar
    {
      width: 8px;
      height: 8px;
      background-color: #f8f9fa;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0,0,0,.1);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      &:hover{
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      }
    }
  }
  
  .ant-table{
    font-weight: 500;
    font-size: 14px;
    line-height: 1.5;
    background: transparent;

    table{
      border-spacing: 0 8px;
      padding: 0 8px;
    }

    .ant-table-thead > tr > th{
      padding: 20px 16px;
      border-bottom: 2px solid #EEEFF2;
      background: #fafafa;
      color: #2c3e50;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    tbody:before {
      content: "-";
      display: block;
      line-height: 1em;
      color: transparent;
    }
    
    tbody{
      font-size: 14px;
      font-weight: 500;
      
      tr {
        background: #ffffff;
        border-radius: 12px;
        margin: 4px 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        border: 1px solid #f0f0f0;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
          border-color: #667eea;
        }
        
        td{
          padding: 20px 16px;
          border-bottom: none;
          background: transparent;
          
          &:first-child {
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
          }
          
          &:last-child {
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
          }
        }
      }
    }
    
    .ant-table-tbody > tr.ant-table-row:hover > td{
      background: transparent;
    }
    
    .ant-table-tbody > tr.ant-table-row-selected > td{
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    }
    
    .ant-table-tbody > tr.ant-table-placeholder{
      background: #fff;
      border-radius: 12px;
    }
  }

  .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before{
    display: none;
  }
  
  .ant-checkbox-inner{
    border-radius: 6px;
    border-color: #d9d9d9;
    
    &:hover {
      border-color: #667eea;
    }
  }
  
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #667eea;
    border-color: #667eea;
  }

  &.table_pointerly{
    .ant-table tbody tr{
      cursor: pointer;
    }
  }
  
  // Badge styles
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-1px);
    }
    
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      animation: pulse 2s infinite;
    }
    
    &.badge-success {
      background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(86, 171, 47, 0.3);
      
      .badge-dot {
        background: rgba(255, 255, 255, 0.9);
      }
    }
    
    &.badge-danger {
      background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(255, 65, 108, 0.3);
      
      .badge-dot {
        background: rgba(255, 255, 255, 0.9);
      }
    }
    
    &.badge-warning {
      background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(255, 167, 38, 0.3);
      
      .badge-dot {
        background: rgba(255, 255, 255, 0.9);
      }
    }
    
    &.badge-secondary {
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
      
      .badge-dot {
        background: rgba(255, 255, 255, 0.9);
      }
    }
  }
  
  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  // Button styles in table
  .ant-btn {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    &:focus {
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }
  
  // Typography improvements
  .ant-typography {
    color: #2c3e50;
    font-weight: 500;
  }
  
  // Image styles
  img {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  // Responsive design improvements
  @media (max-width: 768px) {
    .table__wrapper {
      margin: 0 -16px;
      border-radius: 0;
      box-shadow: none;
      border: none;
    }
    
    .ant-table {
      font-size: 12px;
      
      .ant-table-thead > tr > th {
        padding: 12px 8px;
        font-size: 11px;
      }
      
      tbody tr td {
        padding: 12px 8px;
      }
    }
    
    .badge {
      padding: 4px 8px;
      font-size: 10px;
    }
    
    .ant-btn {
      padding: 4px 8px;
      font-size: 12px;
      
      .anticon {
        font-size: 14px;
      }
    }
  }
  
  @media (max-width: 480px) {
    .table__wrapper {
      .ant-table {
        font-size: 11px;
        
        .ant-table-thead > tr > th {
          padding: 8px 4px;
          font-size: 10px;
        }
        
        tbody tr td {
          padding: 8px 4px;
        }
      }
      
      .badge {
        padding: 2px 6px;
        font-size: 9px;
      }
      
      .ant-btn {
        padding: 2px 6px;
        font-size: 10px;
        min-width: 28px;
        height: 28px;
        
        .anticon {
          font-size: 12px;
        }
      }
    }
  }
}
`

export {
    TableStyleWrapper
}