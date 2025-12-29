import React, { useEffect, useState } from "react";
import Table from "../../Common/Table/Table";
import ClientProvider from "../../../Data/ClientProvider";
import { Button, Image, Popover, Typography, InputNumber } from "antd";
import { DeleteOutlined, EditOutlined, SaveOutlined } from "@mui/icons-material";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { toast } from "react-toastify";
import moment from "moment";
import { useRouter } from "next/router";
import CategoryProvider from "../../../Data/CategoryProvider";

const TableCatListing = ({
  modalIsOpen,
  setModalIsOpen,
  setClientData,
  setId,
  filters,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [clientOpen, setClientOpen] = useState(false);
  const [clientOpenInfo, setClientOpenInfo] = useState({});
  const [updatingOrder, setUpdatingOrder] = useState({});
  const [orderValues, setOrderValues] = useState({});
  const [editingOrder, setEditingOrder] = useState({});

  const handleOrderSave = async (id, newOrder) => {
    if (newOrder === null || newOrder === undefined) {
      return;
    }
    
    // Get original order value
    const originalOrder = data.find(item => item.id === id)?.order || 0;
    
    // If value hasn't changed, just close editing
    if (newOrder === originalOrder) {
      setEditingOrder(prev => ({ ...prev, [id]: false }));
      return;
    }
    
    setUpdatingOrder(prev => ({ ...prev, [id]: true }));
    
    try {
      await CategoryProvider.updateCategoryOrder(id, { order: newOrder });
      toast.success("Порядок категории обновлен!");
      // Refresh data
      const { searchText } = filters;
      const params = new URLSearchParams();
      if (searchText) params.append("searchText", searchText);
      const res = await CategoryProvider.getAllCategory();
      const categories = res.data.results || res.data;
      setData(categories);
      // Update local state and close editing
      setOrderValues(prev => ({ ...prev, [id]: newOrder }));
      setEditingOrder(prev => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error("Error updating category order:", err);
      toast.error(err.response?.data?.error?.[0] || "Ошибка при обновлении порядка!");
      // Revert to original value on error
      setOrderValues(prev => ({ ...prev, [id]: originalOrder }));
    } finally {
      setUpdatingOrder(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleOrderInputChange = (id, value) => {
    setOrderValues(prev => ({ ...prev, [id]: value }));
  };

  const handleEditClick = (id, currentOrder) => {
    setEditingOrder(prev => ({ ...prev, [id]: true }));
    setOrderValues(prev => ({ ...prev, [id]: currentOrder }));
  };

  const handleCancelEdit = (id, originalOrder) => {
    setEditingOrder(prev => ({ ...prev, [id]: false }));
    setOrderValues(prev => ({ ...prev, [id]: originalOrder }));
  };

  const columns = [
    {
      title: "№",
      key: "num",
      render: (text, item, i) => (
        <div className="no_wrap">{i + 1 + 0 * 10}</div>
      ),
    },
    // {
    //   title: "ID",
    //   dataIndex: "id",
    // },
    {
      title: "Иконка",
      dataIndex: "icon",
      render: (icon) => (
        <img src={icon} alt="" style={{ width: "20px" }} />
      ),
    },
    {
      title: "Название",
      dataIndex: "id",
      render: (title, data) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>
            {data.name}
          </Typography>
        </div>
      ),
    },
    {
      title: "Активные объявления",
      dataIndex: "active_count",
      render: (active_count) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>
            {active_count}
          </Typography>
        </div>
      ),
    },
    {
      title: "Порядок",
      dataIndex: "order",
      render: (order, record) => {
        const originalOrder = order || 0;
        const isEditing = editingOrder[record.id] || false;
        const currentOrder = orderValues[record.id] !== undefined 
          ? orderValues[record.id] 
          : originalOrder;
        
        return (
          <div 
            style={{ minWidth: "200px",display: "flex", justifyContent: "center", alignItems: "center" }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", gap: "4px", width: "70%" }}>
              <InputNumber
                min={1}
                value={currentOrder}
                onChange={(value) => handleOrderInputChange(record.id, value)}
                style={{ flex: 1 }}
                disabled={!isEditing || updatingOrder[record.id]}
              />
              {isEditing ? (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => handleOrderSave(record.id, currentOrder)}
                  loading={updatingOrder[record.id]}
                  size="small"
                />
              ) : (
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(record.id, originalOrder)}
                  size="small"
                />
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Действия",
      dataIndex: "id",
      render: (id, data) => (
        <div style={{ minWidth: "150px", display: "flex", gap: 8, justifyContent: "start" }}>
          <Popover content={(
            <div>
              <p style={{ textAlign: 'center' }}>Удалить</p>
            </div>
          )} title="">
            <Button
              type="primary"
              size="small"
              danger
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(255, 77, 79, 0.3)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
                setCategoryId(id);
              }}
            >
              <DeleteOutlined style={{ fontSize: "16px" }} />
            </Button>
          </Popover>
          <Popover content={(
            <div>
              <p style={{ textAlign: 'center' }}>Редактировать</p>
            </div>
          )} title="">
            <Button
              type="primary"
              size="small"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setModalIsOpen(true);
                setId(id);
                setClientData(data);
              }}
            >
              <EditOutlined style={{ fontSize: "16px" }} />
            </Button>
          </Popover>


        </div>
      ),
    },
  ];

  useEffect(() => {
    const { searchText } = filters;

    const params = new URLSearchParams();
    if (searchText) params.append("searchText", searchText);

    setLoading(true);
    CategoryProvider.getAllCategory(0, 10, params.toString())
      .then((res) => {
        console.log(res.data);
        const categories = res.data.results || res.data;
        setData(categories);
        // Initialize order values from fetched data
        const initialOrderValues = {};
        categories.forEach(cat => {
          if (cat.order !== undefined) {
            initialOrderValues[cat.id] = cat.order;
          }
        });
        setOrderValues(initialOrderValues);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status == 401) {
          router.push("/login");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [modalIsOpen, isOpen, filters]);

  const handleDeleteClients = (id) => {
    setConfirmLoading(true);
    CategoryProvider.deleteCategory(id)
      .then((res) => {
        console.log(res);
        toast.success("Kategoriya o'chirildi!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Xatolik!");
      })
      .finally(() => {
        setConfirmLoading(false);
        setIsOpen(false);
      });
  };

  return (
    <div>
      <Table
        {...{
          columns,
          data,
          loading,
          pagination: false,
          onRow: (record, rowIndex) => {
            return {
              onClick: () => {
                setClientOpen(true);
                setClientOpenInfo(record);
                console.log(record, rowIndex);
              },
            };
          },
        }}
      />

      <ModalContextProvider modalIsOpen={isOpen} setIsOpen={setIsOpen}>
        <FormModal
          title={"Удалить категорию"}
          handleCancel={() => setIsOpen(false)}
          width={"450px"}
        >
          <Typography style={{ marginBottom: 20 }}>
            Вы действительно хотите удалить?
          </Typography>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={() => setIsOpen(false)}
              style={{ marginRight: 20 }}
            >
              Назад
            </Button>
            <Button
              type="primary"
              onClick={() => handleDeleteClients(categoryId)}
              loading={confirmLoading}
            >
              Продолжить
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>

      <ModalContextProvider modalIsOpen={clientOpen} setIsOpen={setClientOpen}>
        <FormModal
          title={"Информация о категории"}
          handleCancel={() => setClientOpen(false)}
          width={"750px"}
        >
          <Typography style={{ marginBottom: 20 }}>
            Название - {clientOpenInfo.name}
          </Typography>
          <Typography style={{ marginBottom: 20 }}>
            Иконка <br />
            <Image width={100} height={100} style={{ objectFit: 'contain' }} src={clientOpenInfo.icon} alt={clientOpenInfo.icon} />
          </Typography>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button type="primary" onClick={() => setClientOpen(false)}>
              OK
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
    </div>
  );
};

export default TableCatListing;
