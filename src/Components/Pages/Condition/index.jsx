import React, { useEffect, useState } from "react";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { Button, Col, Form, Input, Row, Upload } from "antd";
import { toast } from "react-toastify";
import TableCondition from "./TableConditions";
import ConditionProvider from "../../../Data/ConditionProvider";
import { useTranslation } from "../../../hooks/useTranslation";

const Condition = () => {
  const { t } = useTranslation();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [clientData, setClientData] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [id, setId] = useState(null);
  const [filters, setFilters] = useState({
    searchText: "",
  });

  const openModal = () => {
    setIsOpen(true);
    setId(null);
    setClientInfo({});
    setClientData({});
    // Form ni to'liq tozalash
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  const handleAddCategory = (values) => {
    setConfirmLoading(true);
    const body = {
      ...values,
    };
    if (id) {
      ConditionProvider.updateCondition(id, body)
        .then((res) => {
          toast.success(t('messages.success.condition_updated'));
          form.resetFields();
        })
        .catch((err) => {
          toast.warning("Xatolik");
        })
        .finally(() => {
          setIsOpen(false);
          setClientInfo({});
          setClientData({});
          setId(null);
          form.resetFields();
        });
    } else {
      ConditionProvider.createCondition(body)
        .then((res) => {
          toast.success(t('messages.success.condition_created'));
          form.resetFields();
        })
        .catch((err) => {
          toast.warning("Xatolik");
        })
        .finally(() => {
          setIsOpen(false);
          setConfirmLoading(false);
          setClientInfo({});
          setClientData({});
          setId(null);
        });
    }
  };

  const handleCancel = (errorInfo) => {
    setIsOpen(false);
    setClientInfo({});
    setClientData({});
    setId(null);
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
    // Form ni to'liq tozalash
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  useEffect(() => {
    if (id) {
      if (clientData && Object.keys(clientData).length > 0) {
        setClientInfo(clientData);
        setTimeout(() => {
          form.setFieldsValue({ ...clientData });
        }, 100);
      } else {
        ConditionProvider.getOneCondition(id)
          .then((res) => {
            const data = res?.data;
            setClientInfo(data);
            setTimeout(() => {
              form.setFieldsValue({ ...data });
            }, 100);
          })
          .catch((err) => {
            if (err.response?.status == 401) {
              router.push("/login");
            }
          });
      }
    } else {
      // Yangi qo'shish holatida form ni tozalash
      setTimeout(() => {
        form.resetFields();
        setClientInfo({});
        setClientData({});
      }, 100);
    }
    // Faqat id o'zgarganda ishlasin, clientData emas!
  }, [id]);

  const handleChange = (e) => {
    // setFilters({ searchText: e.target?.value });
  };

  const handleInput = (values) => {
    setFilters(values);
  };
  const handleReset = (values) => {
    form2.resetFields();
    setFilters({ searchText: "" });
  };


  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e?.fileList);
    return e?.fileList;
  };
  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="breadcrumb" style={{ width: "20%" }}>
          <h1>{t('titles.conditions')}</h1>
        </div>
        <div className="btns">
          <Button
            type="primary"
            htmlType="button"
            onClick={openModal}
          >
            {t('titles.add_condition')}
          </Button>
        </div>
      </div>
      <div className="separator-breadcrumb border-top"></div>
      <TableCondition
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setIsOpen}
        setClientData={setClientData}
        setId={setId}
        filters={filters}
      />

      <ModalContextProvider modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}>
        <FormModal
          title={clientInfo && clientInfo.id ? t('titles.edit_condition') : t('titles.add_condition')}
          handleCancel={handleCancel}
          width={"600px"}
        >
          <Form
            name="basic"
            layout={"vertical"}
            wrapperCol={{
              span: 24,
            }}
            form={form}
            onFinish={handleAddCategory}
            onFinishFailed={handleCancel}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Xolat nomi"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Iltimos, barcha maydonlarni to'ldiring!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{
                    display: "flex",
                    justifyContent: "end",
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
                    {clientInfo?.id ? "Tahrirlash" : "Davom etish"}
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

export default Condition;
