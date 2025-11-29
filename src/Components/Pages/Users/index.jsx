import React, { useEffect, useState } from "react";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { Button, Col, Form, Input, Radio, Row, Upload, Select } from "antd";
import { toast } from "react-toastify";
import TableUsers from "./TableUsers";
import UserProvider from "../../../Data/UserProvider";
import { PatternFormat } from "react-number-format";

const Users = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [clientData, setClientData] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [id, setId] = useState(null);
  const [phone_number, setPhone_number] = useState("");
  const [filters, setFilters] = useState({
    phone_number: "",
    full_name: "",
    listings_count: "",
    address: "",
  });
  const [isBlocked, setIsBlocked] = useState('')

  const handleAddUser = async (values) => {
    setConfirmLoading(true);
    console.log(values);
    const body = {
      ...values,
      phone_number: values.phone_number.replace(/[^+\d]/g, ""),
      is_blocked: values.is_blocked,
    };
    if (id) {
      UserProvider.updateUser(id, { ...values })
        .then((res) => {
          toast.success("Пользователь отредактирован!");
          form.resetFields();
        })
        .catch((err) => {
          console.log(err);
          toast.warning("Ошибка");
        })
        .finally(() => {
          setIsOpen(false);
          setConfirmLoading(false);
          setClientInfo({});
        });
    } else {
      await UserProvider.createUser(body)
        .then((res) => {
          console.log(res);
          toast.success("Пользователь добавлен!");
          form.resetFields();
        })
        .catch((err) => {
          console.log(err);
          toast.warning("Ошибка");
        })
        .finally(() => {
          setIsOpen(false);
          setConfirmLoading(false);
        });
    }
  };
  const handleCancel = (errorInfo) => {
    console.log(errorInfo);
    setIsOpen(false);
    setClientInfo({});
    setClientData({});
    setId(null);
    setPhone_number("");
    // Form ni to'liq tozalash
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  const closeModal = () => {
    setIsOpen(false);
    setClientInfo({});
    setClientData({});
    setId(null);
    setPhone_number("");
    // Form ni to'liq tozalash
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };
  useEffect(() => {
    if (id) {
      UserProvider.getOneUser(id)
        .then((res) => {
          const data = res?.data;
          setClientInfo(data);
          // 998 ni olib tashlash
          const phone = data.phone_number?.startsWith("998")
            ? data.phone_number.slice(3)
            : data.phone_number;
          setPhone_number(phone); // input uchun
          setTimeout(() => {
            form.setFieldsValue({
              ...data,
              phone_number: phone, // form uchun ham
            });
          }, 100);
        })
        .catch((err) => {
          console.error("Error fetching client data:", err);
          if (err.response?.status == 401) {
            router.push("/login");
          }
        });
    } else {
      // Yangi qo'shish holatida form ni tozalash
      setTimeout(() => {
        form.resetFields();
        setPhone_number(""); // inputni tozalash
        setClientInfo({});
        setClientData({});
      }, 100);
    }
  }, [id]);


  const handleInput = (values) => {
    setFilters(values);
  };
  const handleReset = (values) => {
    form2.resetFields();
    setFilters({ 
      phone_number: "",
      full_name: "",
      listings_count: "",
      address: "",
    });
  };

  return (
    <>
      <div className="d-flex flex-column mb-3">
        <div className="breadcrumb" style={{ width: "20%" }}>
          <h1>Пользователи</h1>
        </div>
        <Form
          name="basic"
          layout={"vertical"}
          wrapperCol={{
            span: 25,
          }}
          form={form2}
          onFinish={handleInput}
          autoComplete="off"
          style={{ width: "100%" }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="" name="is_blocked">
                <Select
                  placeholder={"Выберите статус"}
                  allowClear
                  onChange={(value) => setIsBlocked(value)}
                >
                  <Select.Option value="">Все</Select.Option>
                  <Select.Option value={true}>Заблокирован</Select.Option>
                  <Select.Option value={false}>Не заблокирован</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="phone_number">
                <Input placeholder={"Номер телефона"} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="full_name">
                <Input placeholder={"Полное имя"} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="listings_count">
                <Input placeholder={"Количество объявлений"} type="number" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="address">
                <Input placeholder={"Адрес"} />
              </Form.Item>
            </Col>
            <Col span={18} style={{ textAlign: 'right' }}>
              <Button htmlType="button" onClick={handleReset} style={{ marginRight: 20 }}>Очистить</Button>
              <Button type="primary" htmlType="submit">Фильтр</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="separator-breadcrumb border-top"></div>
      <TableUsers
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setIsOpen}
        setClientData={setClientData}
        setId={setId}
        filters={filters}
        isBlocked={isBlocked}
      />

      <ModalContextProvider modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}>
        <FormModal
            title={
            clientInfo?.id
              ? "Редактировать пользователя"
              : "Добавить пользователя"
          }
          handleCancel={handleCancel}
          width={"500px"}
        >
          <Form
            name="basic"
            layout={"vertical"}
            wrapperCol={{
              span: 24,
            }}
            form={form}
            // initialValues={clientData}
            onFinish={handleAddUser}
            onFinishFailed={handleCancel}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={"Номер телефона"}
                  name="phone_number"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, заполните поле",
                    },
                  ]}
                >
                  <PatternFormat
                    format="998(##) ### ## ##"
                    className="form-control"
                    mask="_"
                    name="phone_number"
                    allowEmptyFormatting
                    value={phone_number}
                    style={{ width: "100%", fontSize: 14, height: 32 }}
                    onChange={(e) => setPhone_number(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label={"Статус пользователя"} name="is_blocked">
                  <Radio.Group
                    block
                    options={[
                      { label: "Заблокирован", value: true },
                      { label: "Не заблокирован", value: false },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>

                <Form.Item
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: 55,
                  }}
                >
                  <Button onClick={closeModal} style={{ marginRight: 20 }}>
                    Назад
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={confirmLoading}
                  >
                    {clientInfo?.id ? "Редактировать" : "Добавить"}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </FormModal>
      </ModalContextProvider>
    </>
  );
};

export default Users;
