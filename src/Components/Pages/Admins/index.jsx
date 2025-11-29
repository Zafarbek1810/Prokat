import React, { useEffect, useState } from "react";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { Button, Col, Form, Input, Radio, Row, Upload } from "antd";
import { toast } from "react-toastify";
import TableAdmins from "./TableAdmins";
import AdminProvider from "../../../Data/AdminProvider";

const Admins = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [clientData, setClientData] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [id, setId] = useState(null);
  const [filters, setFilters] = useState({
    query: "",
  });
  const [isBlocked, setIsBlocked] = useState('')

  const handleAddAdmin = async (values) => {
    setConfirmLoading(true);
    console.log(values);

    if (id) {
      // Admin tahrirlash
      const body = {
        username: values.username,
        full_name: values.full_name,
        email: values.email,
      };

      // Agar parol kiritilgan bo'lsa, uni ham qo'shamiz
      if (values.password && values.password.trim() !== '') {
        body.password = values.password;
        body.password_confirm = values.password_confirm;
      }

      await AdminProvider.updateAdmin(id, body)
        .then((res) => {
          console.log(res);
          toast.success("Администратор отредактирован!");
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
      // Yangi admin yaratish
      const body = {
        username: values.username,
        password: values.password,
        password_confirm: values.password_confirm,
        full_name: values.full_name,
        email: values.email,
      };
      await AdminProvider.createAdmin(body)
        .then((res) => {
          console.log(res);
          toast.success("Администратор добавлен!");
          form.resetFields();
        })
        .catch((err) => {
          err.response.data.error.map(err => (
            toast.error(err)
          ))
        })
        .finally(() => {
          setIsOpen(false);
          setConfirmLoading(false);
        });
    }
  };
  const handleCancel = (errorInfo) => {
    console.log(errorInfo.errorFields);
    errorInfo.errorFields.map((err) => (
      toast.error(err.errors[0])
    ))
    setIsOpen(false);
    setClientInfo({});
    setClientData({});
    setId(null);
    // Form ni to'liq tozalash
    form.resetFields();
    // Email va password maydonlarini qo'lda tozalash
    setTimeout(() => {
      form.setFieldsValue({
        username: '',
        full_name: '',
        email: '',
        password: '',
        password_confirm: '',
      });
    }, 50);
  };

  const closeModal = () => {
    setIsOpen(false);
    setClientInfo({});
    setClientData({});
    setId(null);
    // Form ni to'liq tozalash
    form.resetFields();
    // Email va password maydonlarini qo'lda tozalash
    setTimeout(() => {
      form.setFieldsValue({
        username: '',
        full_name: '',
        email: '',
        password: '',
        password_confirm: '',
      });
    }, 50);
  };
  useEffect(() => {
    if (id) {
      // Avval form ni tozalash
      form.resetFields();
      setClientInfo({});
      setClientData({});

      // Keyin yangi ma'lumotlarni yuklash
      AdminProvider.getOneAdmin(id)
        .then((res) => {
          const data = res?.data;
          setClientInfo(data);
          setClientData(data);

          // Form maydonlarini to'ldirish
          setTimeout(() => {
            form.setFieldsValue({
              username: data.username || '',
              full_name: data.full_name || '',
              email: data.email || '',
              password: '', // Parol maydonini bo'sh qoldirish
              password_confirm: '', // Parol tasdiqlash maydonini bo'sh qoldirish
            });
          }, 200);
        })
        .catch((err) => {
          console.error("Error fetching admin data:", err);
          if (err.response?.status == 401) {
            router.push("/login");
          }
        });
    } else {
      // Yangi qo'shish holatida form ni tozalash
      form.resetFields();
      setClientInfo({});
      setClientData({});
    }
  }, [id]);

  const handleChange = (e) => {
    setFilters({ query: e.target?.value || '' });
  };

  const handleInput = (values) => {
    setFilters({
      query: values.query || ''
    });
  };

  const handleReset = (values) => {
    form2.resetFields();
    setFilters({ query: "" });
  };

  const openModal = () => {
    setIsOpen(true);
    setId(null);
    setClientData({});
    setClientInfo({});
    // Form ni to'liq tozalash
    form.resetFields();
    // Email va password maydonlarini qo'lda tozalash
    setTimeout(() => {
      form.setFieldsValue({
        username: '',
        full_name: '',
        email: '',
        password: '',
        password_confirm: '',
      });
    }, 50);
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3 gap-5">
        <div className="breadcrumb" style={{ width: "20%" }}>
          <h1>Администраторы</h1>
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
            <Col span={8}>
              <Form.Item name="query">
                <Input placeholder={"Поиск"} name="query" onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button htmlType="button" onClick={handleReset} style={{ marginRight: 20 }}>Очистить</Button>
              <Button type="primary" htmlType="submit">Фильтр</Button>
            </Col>
          </Row>
        </Form>
        <div className="btns">
          <Button
            type="primary"
            htmlType="button"
            onClick={openModal}
          >
            Добавить администратора
          </Button>
        </div>
      </div>
      <div className="separator-breadcrumb border-top"></div>
      <TableAdmins
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
              ? "Редактировать администратора"
              : "Добавить администратора"
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
            onFinish={handleAddAdmin}
            onFinishFailed={handleCancel}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Имя пользователя"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, заполните поле",
                    },
                  ]}
                >
                  <Input placeholder="Введите имя пользователя" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Полное имя"}
                  name="full_name"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, заполните поле",
                    },
                  ]}
                >
                  <Input placeholder='Полное имя' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Электронная почта"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, заполните поле",
                    },
                    {
                      type: "email",
                      message: "Пожалуйста, введите правильный формат адреса электронной почты.",
                    },
                  ]}
                >
                  <Input placeholder="Введите адрес электронной почты" autoComplete="off" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={id ? "Новый пароль" : "Пароль"}
                  name="password"
                  rules={[
                    ...(id ? [] : [{
                      required: true,
                      message: "Пожалуйста, введите пароль.",
                    }]),
                    {
                      min: 6,
                      message: "Пароль должен быть длиной не менее 6 символов.",
                    },
                  ]}
                >
                  <Input.Password 
                    placeholder={id ? "Введите новый пароль (оставьте пустым)" : "Введите пароль"} 
                    autoComplete="new-password"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={id ? "Подтвердите новый пароль" : "Подтвердите пароль"}
                  name="password_confirm"
                  rules={[
                    ...(id ? [] : [{
                      required: true,
                      message: "Пожалуйста, подтвердите пароль.",
                    }]),
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const password = getFieldValue("password");
                        if (!password && !value) {
                          return Promise.resolve();
                        }
                        if (!value || password === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Пароли не совпадают!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    placeholder={id ? "Введите новый пароль еще раз" : "Повторно введите пароль"} 
                    autoComplete="new-password"
                  />
                </Form.Item>
              </Col>
            </Row>

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
                {clientInfo?.id ? "Редактировать" : "Добавлять"}
              </Button>
            </Form.Item>
          </Form>
        </FormModal>
      </ModalContextProvider>
    </>
  );
};

export default Admins;
