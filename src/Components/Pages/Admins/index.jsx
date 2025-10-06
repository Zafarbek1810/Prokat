import React, { useEffect, useState } from "react";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { Button, Col, Form, Input, Radio, Row, Upload } from "antd";
import { toast } from "react-toastify";
import TableAdmins from "./TableAdmins";
import AdminProvider from "../../../Data/AdminProvider";
import { useTranslation } from "../../../hooks/useTranslation";

const Admins = () => {
  const { t } = useTranslation();
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
          toast.success(t('messages.success.admin_updated'));
          form.resetFields();
        })
        .catch((err) => {
          console.log(err);
          toast.warning(t('messages.error.general'));
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
          toast.success(t('messages.success.admin_created'));
          form.resetFields();
        })
        .catch((err) => {
          console.log(err);
          toast.warning(t('messages.error.general'));
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
    // Form ni to'liq tozalash
    form.resetFields();
  };

  const closeModal = () => {
    setIsOpen(false);
    setClientInfo({});
    setClientData({});
    setId(null);
    // Form ni to'liq tozalash
    form.resetFields();
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
    setFilters({ query: e.target?.value });
  };

  const handleInput = (values) => {
    setFilters(values);
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
    // Form ni tozalash
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3 gap-5">
        <div className="breadcrumb" style={{ width: "20%" }}>
          <h1>{t('titles.admins')}</h1>
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
                <Input placeholder={t('placeholders.search')} name="query" onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button htmlType="button" onClick={handleReset} style={{ marginRight: 20 }}>{t('buttons.clear')}</Button>
              <Button type="primary" htmlType="submit">{t('buttons.filter')}</Button>
            </Col>
          </Row>
        </Form>
        <div className="btns">
          <Button
            type="primary"
            htmlType="button"
            onClick={openModal}
          >
            {t('titles.add_admin')}
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
              ? t('titles.edit_admin')
              : t('titles.add_admin')
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
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: t('validation.required'),
                    },
                  ]}
                >
                  <Input placeholder="Username kiriting" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('forms.full_name')}
                  name="full_name"
                  rules={[
                    {
                      required: true,
                      message: t('validation.required'),
                    },
                  ]}
                >
                  <Input placeholder={t('placeholders.full_name')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: t('validation.required'),
                    },
                    {
                      type: "email",
                      message: "To'g'ri email formatini kiriting",
                    },
                  ]}
                >
                  <Input placeholder="Email kiriting" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={id ? "Yangi parol (ixtiyoriy)" : "Parol"}
                  name="password"
                  rules={[
                    ...(id ? [] : [{
                      required: true,
                      message: "Iltimos parol kiriting",
                    }]),
                    {
                      min: 6,
                      message: "Parol kamida 6 ta belgi bo'lishi kerak",
                    },
                  ]}
                >
                  <Input.Password placeholder={id ? "Yangi parol kiriting (bo'sh qoldiring)" : "Parol kiriting"} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={id ? "Yangi parolni tasdiqlash" : "Parolni tasdiqlash"}
                  name="password_confirm"
                  rules={[
                    ...(id ? [] : [{
                      required: true,
                      message: "Iltimos parolni tasdiqlang",
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
                          new Error("Parollar mos kelmaydi!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder={id ? "Yangi parolni qayta kiriting" : "Parolni qayta kiriting"} />
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
                Orqaga
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={confirmLoading}
              >
                {clientInfo?.id ? "Tahrirlash" : "Qo'shish"}
              </Button>
            </Form.Item>
          </Form>
        </FormModal>
      </ModalContextProvider>
    </>
  );
};

export default Admins;
