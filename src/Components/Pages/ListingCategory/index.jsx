import React, { useEffect, useState, useRef } from "react";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { Button, Col, Form, Input, Row, Tabs, Select } from "antd";
import { toast } from "react-toastify";
import TableCatListing from "./TableCatListing";
import CategoryProvider from "../../../Data/CategoryProvider";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const { TabPane } = Tabs;
const { Option } = Select;

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

  // New state for tabs and parent categories
  const [activeTab, setActiveTab] = useState("main");
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);

  // Fetch main categories for parent dropdown
  const fetchMainCategories = async () => {
    try {
      const res = await CategoryProvider.getMainCategories();
      const categories = res.data.results || res.data || [];
      setMainCategories(categories);
    } catch (err) {
      console.error("Error fetching main categories:", err);
    }
  };

  useEffect(() => {
    fetchMainCategories();
  }, [modalIsOpen]);

  const handleAddCategory = async (values) => {
    setConfirmLoading(true);

    if (id) {
      // UPDATE
      const formData = new FormData();
      formData.append("name_uz", values.name_uz);
      formData.append("name_ru", values.name_ru);
      formData.append("name_en", values.name_en || "");
      if (imgUrl) {
        formData.append("icon", imgUrl);
      }
      // Include parent for subcategories
      if (selectedParent) {
        formData.append("parent", selectedParent);
      }
      try {
        await CategoryProvider.updateCategory(id, formData);
        toast.success("Категория отредактирована!");
        form.resetFields();
        setImgUrl("");
        setSelectedParent(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        toast.warning(err.response?.data?.error?.[0] || "Ошибка при редактировании");
      } finally {
        setIsOpen(false);
        setConfirmLoading(false);
        setClientInfo({});
        setClientData({});
        setId(null);
      }
    } else {
      // CREATE
      const formData = new FormData();
      formData.append("name_uz", values.name_uz);
      formData.append("name_ru", values.name_ru);
      formData.append("name_en", values.name_en || "");
      if (imgUrl) {
        formData.append("icon", imgUrl);
      }
      // Add parent if creating subcategory
      if (activeTab === "sub" && selectedParent) {
        formData.append("parent", selectedParent);
      }
      try {
        await CategoryProvider.createCategory(formData);
        const categoryType = activeTab === "sub" ? "Подкатегория" : "Категория";
        toast.success(`${categoryType} добавлена!`);
        form.resetFields();
        setImgUrl("");
        setSelectedParent(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        toast.warning(err.response?.data?.error?.[0] || "Ошибка при создании");
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
    setSelectedParent(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    setSelectedParent(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  useEffect(() => {
    if (id && modalIsOpen) {
      // Fetch category with both languages to get name_uz and name_ru
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
            icon: uzCategory?.icon || ruCategory?.icon || '',
            parent_id: uzCategory?.parent_id || null,
            is_main_category: uzCategory?.is_main_category
          };

          console.log('Fetched category data:', data);

          setClientInfo(data);

          // Set parent for subcategories
          if (data.parent_id) {
            setSelectedParent(data.parent_id);
          }

          // Wait a bit longer for modal to fully mount
          setTimeout(() => {
            form.setFieldsValue({
              name_uz: data.name_uz,
              name_ru: data.name_ru,
              name_en: data.name_en,
            });
          }, 300);

          setImgUrl("");
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
      // New category - reset form
      setTimeout(() => {
        form.resetFields();
        setClientInfo({});
        setClientData({});
        setImgUrl("");
        setSelectedParent(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 100);
    }
  }, [id, modalIsOpen]);

  const getModalTitle = () => {
    if (clientInfo?.id) {
      return clientInfo.is_main_category === false
        ? "Редактировать подкатегорию"
        : "Редактировать категорию";
    }
    return activeTab === "sub" ? "Добавить подкатегорию" : "Добавить категорию";
  };

  const getButtonText = () => {
    return activeTab === "sub" ? "Добавить подкатегорию" : "Добавить категорию";
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="breadcrumb" style={{ width: "40%" }}>
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
              setSelectedParent(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              setTimeout(() => {
                form.resetFields();
              }, 100);
            }}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
      <div className="separator-breadcrumb border-top"></div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
        <TabPane tab="Основные категории" key="main" />
        <TabPane tab="Подкатегории" key="sub" />
      </Tabs>

      <TableCatListing
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setIsOpen}
        setClientData={setClientData}
        setId={setId}
        filters={filters}
        categoryType={activeTab}
      />

      <ModalContextProvider modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}>
        <FormModal
          title={getModalTitle()}
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
                {/* Parent category selection for subcategories */}
                {(activeTab === "sub" || clientInfo?.parent_id) && (
                  <Form.Item
                    label="Основная категория"
                    required={activeTab === "sub"}
                  >
                    <Select
                      placeholder="Выберите основную категорию"
                      value={selectedParent}
                      onChange={setSelectedParent}
                      style={{ width: "100%" }}
                    >
                      {mainCategories.map((cat) => (
                        <Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                <Form.Item
                  label={activeTab === "sub" ? "Название подкатегории (уз)" : "Название категории (уз)"}
                  name="name_uz"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, заполните это поле!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={activeTab === "sub" ? "Название подкатегории (рус)" : "Название категории (рус)"}
                  name="name_ru"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, заполните это поле!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={activeTab === "sub" ? "Название подкатегории (en)" : "Название категории (en)"}
                  name="name_en"
                >
                  <Input />
                </Form.Item>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8 }}>Иконка</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setImgUrl(e.target.files[0])}
                  />
                  {clientInfo?.icon && !imgUrl && (
                    <img src={clientInfo.icon} alt="icon" width={50} style={{ marginTop: 10 }} />
                  )}
                </div>

                <Form.Item
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: 24,
                  }}
                >
                  <Button onClick={closeModal} style={{ marginRight: 20 }}>
                    Назад
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={confirmLoading}
                    disabled={activeTab === "sub" && !selectedParent && !clientInfo?.id}
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
