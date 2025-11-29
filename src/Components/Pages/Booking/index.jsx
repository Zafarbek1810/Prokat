import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select } from "antd";
import TableBooking from "./TableBooking";
import BookingProvider from "../../../Data/BookingProvider";
import styled from "styled-components";
const StatisticStyle = styled.div`
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
`


const Booking = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [clientData, setClientData] = useState({});
  const [id, setId] = useState(null);
  const [data, setData] = useState([])
  const [filters, setFilters] = useState({
    query: "",
    user_id: "",
  });

  useEffect(() => {
    console.log('filters', filters);

    const { status = '', ordering = '', payment_type = '', rental_type = '', search = '' } = filters || {};
    BookingProvider.getAllBookings(status, ordering, payment_type, rental_type, search, 1)
      .then((res) => {
        setData(res.data.statistics || res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status == 401) {
          router.push("/login");
        }
      })
  }, [modalIsOpen, filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, search: e.target?.value });
  };

  const handleInput = (values) => {
    setFilters(values);
  };
  const handleReset = (values) => {
    form2.resetFields();
    setFilters({ search: "", user_id: "" });
  };

  const statusOptions = [
    { label: 'Все', value: '' },
    { label: 'Ожидает', value: 'pending' },
    { label: 'Подтвержденный', value: 'confirmed' },
    { label: 'Завершенный', value: 'completed' },
    { label: 'Отменено', value: 'cancelled' },
  ];
  const rentalTypeOption = [
    { label: 'Все', value: '' },
    { label: 'Почасовой', value: 'hourly' },
    { label: 'Ежедневно', value: 'daily' },
  ];
  const paymentTypeOption = [
    { label: 'Все', value: '' },
    { label: 'Наличные', value: 'cash' },
    { label: 'Карта', value: 'card' },
  ];


  return (
    <StatisticStyle>
      <div className="d-flex justify-content-between mb-3 align-items-start">
        <div className="breadcrumb" style={{ width: "20%" }}>
          <h1>Арендовано</h1>
        </div>
        <Form
          name="basic"
          layout={"vertical"}
          wrapperCol={{ span: 24 }}
          form={form2}
          onFinish={handleInput}
          autoComplete="off"
          style={{ width: "80%" }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="search">
                <Input placeholder={"Поиск"} name="search" onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status">
                <Select placeholder={"Выберите статус"} allowClear options={statusOptions} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="rental_type">
                <Select placeholder={"Выберите тип аренды"} allowClear options={rentalTypeOption} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="payment_type">
                <Select placeholder={"Выберите тип оплаты"} allowClear options={paymentTypeOption} />
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button htmlType="button" onClick={handleReset} style={{ marginRight: 20 }}>Очистить</Button>
              <Button type="primary" htmlType="submit">Фильтр</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{data?.total || 0}</div>
          <div className="stat-label">ВСЕ</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data?.cancelled || 0}</div>
          <div className="stat-label">Отменено</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data?.completed || 0}</div>
          <div className="stat-label">Завершенный</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data?.confirmed || 0}</div>
          <div className="stat-label">Подтвержденный</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data?.pending || 0}</div>
          <div className="stat-label">ОЖИДАЮТ</div>
        </div>
      </div>
      <div className="separator-breadcrumb border-top"></div>
      <TableBooking
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setIsOpen}
        setClientData={setClientData}
        setId={setId}
        filters={filters}
      />


    </StatisticStyle>
  );
};

export default Booking;
