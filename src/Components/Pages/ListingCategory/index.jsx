import React, { useEffect, useState, useRef } from "react";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { Button, Col, Form, Input, Row, Upload } from "antd";
import { toast } from "react-toastify";
import TableCatListing from "./TableCatListing";
import CategoryProvider from "../../../Data/CategoryProvider";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const Listingcategory = () => {
  const router = useRouter();
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
      formData.append("name_en", values.name_en);
      if (imgUrl) {
        formData.append("icon", imgUrl);
      }
      try {
        await CategoryProvider.updateCategory(id, formData);
          toast.success("Категория отредактирована!");
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
      formData.append("name_en", values.name_en);
      formData.append("icon", imgUrl);
      try {
        await CategoryProvider.createCategory(formData);
          toast.success("Категория добавлена!");
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
    if (id && modalIsOpen) {
      // Fetch category with both languages to get name_uz and name_ru
      // This ensures we always get both translations regardless of current language
      const fetchCategoryData = async () => {
        try {
          // Get all categories with different languages
          const [uzRes, ruRes, enRes] = await Promise.all([
            CategoryProvider.getAllCategoryWithLanguage('uz'),
            CategoryProvider.getAllCategoryWithLanguage('ru'),
            CategoryProvider.getAllCategoryWithLanguage('en')
          ]);
          
          const uzCategories = uzRes?.data?.results || uzRes?.data || [];
          const uzCategory = uzCategories.find(cat => cat.id === id);
          
          const ruCategories = ruRes?.data?.results || ruRes?.data || [];
          const ruCategory = ruCategories.find(cat => cat.id === id);
          
          const enCategories = enRes?.data?.results || enRes?.data || [];
          const enCategory = enCategories.find(cat => cat.id === id);
          
          const data = {
            ...uzCategory,
            name_uz: uzCategory?.name || '',
            name_ru: ruCategory?.name || '',
            name_en: enCategory?.name || '',
            icon: uzCategory?.icon || ruCategory?.icon || ''
          };
          
          console.log('Fetched category data:', data);
          console.log('uzCategory:', uzCategory);
          console.log('ruCategory:', ruCategory);
          
          setClientInfo(data);
          
          // Wait a bit longer for modal to fully mount
          setTimeout(() => {
            form.setFieldsValue({
              name_uz: data.name_uz,
              name_ru: data.name_ru,
              name_en: data.name_en,
            });
            console.log('Form values set:', { name_uz: data.name_uz, name_ru: data.name_ru, name_en: data.name_en });
          }, 300);
          
          setImgUrl(""); // Fayl inputni bo'sh qoldiramiz
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
          console.error("Error fetching client data:", err);
          if (err.response?.status == 401) {
            router.push("/login");
          }
        }
      };
      
      fetchCategoryData();
    } else if (!id && modalIsOpen) {
      // Yangi qo'shish holatida form ni tozalash
      setTimeout(() => {
        form.resetFields();
        setClientInfo({});
        setClientData({});
        setImgUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 100);
    }
  }, [id, modalIsOpen]);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="breadcrumb" style={{ width: "20%" }}>
          <h1>Категории</h1>
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
            Добавить категорию
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
          title={clientInfo && clientInfo.id ? "Редактировать категорию" : "Добавить категорию"}
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
                  label="Название категории (уз)"
                  name="name_uz"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, заполните все поля!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Название категории (en)"
                  name="name_en"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, заполните все поля!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Название категории (рус)"
                  name="name_ru"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, заполните все поля!",
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
                    Назад
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={confirmLoading}
                  >
                    {clientInfo?.id ? "Сохранить" : "Продолжить"}
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
