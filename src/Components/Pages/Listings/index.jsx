import React, { useEffect, useState } from "react";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select } from "antd";
import ListingProvider from "../../../Data/ListingProvider";
import { toast } from "react-toastify";
import { PatternFormat } from "react-number-format";
import { useRouter } from "next/router";
import TableListings from "./TableListings";
import CategoryProvider from '../../../Data/CategoryProvider';
import UserProvider from '../../../Data/UserProvider';
import { useTranslation } from "../../../hooks/useTranslation";

const Listings = () => {
  const { t } = useTranslation();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [clientData, setClientData] = useState({});
  const [id, setId] = useState(null);
  const [filters, setFilters] = useState({
    query: "",
    user_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    CategoryProvider.getAllCategory().then(res => {
      setCategories(res.data.results || res.data);
    });
    
    UserProvider.getAllUsers('', '', 1000).then(res => {
      setUsers(res.data.results || res.data);
    });
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  // useEffect(() => {
  //   if (id) {
  //     ClientProvider.getOneClient(id)
  //       .then((res) => {
  //         const data = res?.data;
  //         setClientInfo(data);
  //         setBirthDate(data?.dateOfBirth);
  //         setGen(data?.gender);
  //         form.setFieldsValue({
  //           ...data,
  //           dateOfBirth: data?.dateOfBirth ? moment(data?.dateOfBirth) : null,
  //         });
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching client data:", err);
  //         if (err.response?.status == 401) {
  //           router.push("/login");
  //         }
  //       });
  //   } else {
  //     form.resetFields();
  //     setBirthDate("");
  //     setGen("");
  //   }
  // }, [id, form]);

  const handleChange = (e) => {
    setFilters({ ...filters, query: e.target?.value });
  };

  const handleInput = (values) => {
    setFilters(values);
  };
  const handleReset = (values) => {
    form2.resetFields();
    setFilters({ query: "", user_id: "" });
  };

  const statusOptions = [
    { label: 'Barchasi', value: '' },
    { label: 'Kutilmoqda', value: 'pending' },
    { label: 'Faol', value: 'active' },
    { label: 'Rad etilgan', value: 'rejected' },
  ];
 

  return (
    <>
      <div className="d-flex justify-content-between mb-3 align-items-start">
        <div className="breadcrumb" style={{ width: "20%" }}>
          <h1>{t('titles.listings')}</h1>
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
              <Form.Item name="query">
                <Input placeholder={t('placeholders.search')} name="query" onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="category_id">
                <Select placeholder={t('forms.select_category')} allowClear>
                  <Select.Option value="">{t('forms.all')}</Select.Option>
                  {categories.map(cat => {
                    return(
                      <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status">
                <Select placeholder={t('forms.select_status')} allowClear options={statusOptions} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="user_id">
                <Select placeholder={t('forms.select_user')} allowClear>
                  <Select.Option value="">{t('forms.all')}</Select.Option>
                  {users.map(user => {
                    return(
                      <Select.Option key={user.id} value={user.id}>{user.full_name}</Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button htmlType="button" onClick={handleReset} style={{ marginRight: 20 }}>{t('buttons.clear')}</Button>
              <Button type="primary" htmlType="submit">{t('buttons.filter')}</Button>
            </Col>
          </Row>
        </Form>
       
      </div>
      <div className="separator-breadcrumb border-top"></div>
      <TableListings
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setIsOpen}
        setClientData={setClientData}
        setId={setId}
        filters={filters}
      />

      
    </>
  );
};

export default Listings;
