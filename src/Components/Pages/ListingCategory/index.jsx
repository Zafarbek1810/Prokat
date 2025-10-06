import React, { useEffect, useState, useRef } from "react";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { Button, Col, Form, Input, Row, Upload } from "antd";
import { toast } from "react-toastify";
import TableCatListing from "./TableCatListing";
import CategoryProvider from "../../../Data/CategoryProvider";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "../../../hooks/useTranslation";

const Listingcategory = () => {
  const { t } = useTranslation();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [clientData, setClientData] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [id, setId] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [filters, setFilters] = useState({
    searchText: "",
  });
  const fileInputRef = useRef(null);

  const handleAddCategory = async (values) => {
    setConfirmLoading(true);

    if (id) {
      // UPDATE
      const formData = new FormData();
      formData.append("name_uz", values.name_uz);
      formData.append("name_ru", values.name_ru);
      if (imgUrl) {
        formData.append("icon", imgUrl);
      }
      try {
        await CategoryProvider.updateCategory(id, formData);
          toast.success(t('messages.success.category_updated'));
        form.resetFields();
        setImgUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        toast.warning(err.response.data.error[0]);
      } finally {
        setIsOpen(false);
        setConfirmLoading(false);
        setClientInfo({});
        setClientData({});
        setId(null);
      }
    } else {
      // CREATE (sizda bor)
      const formData = new FormData();
      formData.append("name_uz", values.name_uz);
      formData.append("name_ru", values.name_ru);
      formData.append("icon", imgUrl);
      try {
        await CategoryProvider.createCategory(formData);
          toast.success(t('messages.success.category_created'));
        form.resetFields();
        setImgUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        toast.warning(err.response.data.error[0]);

      } finally {
        setIsOpen(false);
        setConfirmLoading(false);
      }
    }
  };
  const handleCancel = (errorInfo) => {
    console.log(errorInfo);
    setIsOpen(false);
    setClientInfo({});
    setClientData({});
    setId(null);
    setImgUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    setImgUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    // Form ni to'liq tozalash
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  useEffect(() => {
    if (id) {
      // Agar clientData to'liq bo'lsa, uni formga joylaymiz
      if (clientData && Object.keys(clientData).length > 0) {
        setClientInfo(clientData);
        setTimeout(() => {
          form.setFieldsValue({ ...clientData });
        }, 100);
        setImgUrl(""); // Fayl inputni bo'sh qoldiramiz
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        CategoryProvider.getOneCategory(id)
          .then((res) => {
            const data = res?.data;
            setClientInfo(data);
            setTimeout(() => {
              form.setFieldsValue({
                ...data,
              });
            }, 100);
          })
          .catch((err) => {
            console.error("Error fetching client data:", err);
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
        setImgUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 100);
    }
  }, [id]);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="breadcrumb" style={{ width: "20%" }}>
          <h1>{t('titles.categories')}</h1>
        </div>
        <div className="btns">
          <Button
            type="primary"
            htmlType="button"
            onClick={() => {
              setIsOpen(true);
              setId(null);
              setClientData({});
              setClientInfo({});
              setImgUrl("");
              if (fileInputRef.current) fileInputRef.current.value = "";
              // Form ni to'liq tozalash
              setTimeout(() => {
                form.resetFields();
              }, 100);
            }}
          >
            {t('titles.add_category')}
          </Button>
        </div>
      </div>
      <div className="separator-breadcrumb border-top"></div>
      <TableCatListing
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setIsOpen}
        setClientData={setClientData}
        setId={setId}
        filters={filters}
      />

      <ModalContextProvider modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}>
        <FormModal
          title={clientInfo && clientInfo.id ? "Kategoriya tahrirlash" : "Kategoriya qo'shish"}
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
                  label="Kategoriya nomi uz"
                  name="name_uz"
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
                  label="Kategoriya nomi ru"
                  name="name_ru"
                  rules={[
                    {
                      required: true,
                      message: "Iltimos, barcha maydonlarni to'ldiring!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setImgUrl(e.target.files[0])}
                />
                {clientInfo?.icon && !imgUrl && (
                  <img src={clientInfo.icon} alt="icon" width={50} style={{ marginTop: 10 }} />
                )}

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

export default Listingcategory;
