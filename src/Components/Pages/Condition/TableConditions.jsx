import React, { useEffect, useState } from "react";
import Table from "../../Common/Table/Table";
import { Button, Image, Popover, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CategoryProvider from "../../../Data/CategoryProvider";
import ConditionProvider from "../../../Data/ConditionProvider";

const TableCondition = ({
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
      title: "Действия",
      dataIndex: "id",
      render: (id, data) => (
        <div style={{ minWidth: "150px", display: "flex", gap: 8 }}>
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
                console.log(data);
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
    ConditionProvider.getAllCondition(0, 10, params.toString())
      .then((res) => {
        console.log(res.data);
        setData(res.data.results);
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
    ConditionProvider.deleteCondition(id)
      .then((res) => {
        console.log(res);
        toast.success("Состояние удалено!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Ошибка!");
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
          title={"Удалить состояние"}
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
          title={"Информация о состоянии"}
          handleCancel={() => setClientOpen(false)}
          width={"750px"}
        >
          <Typography style={{ marginBottom: 20 }}>
            Название: {clientOpenInfo.name}
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

export default TableCondition;
