import React, { useEffect, useState } from "react";
import Table from "../../Common/Table/Table";
import { Button, Image, Input, Popover, Typography, Spin } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
} from "@mui/icons-material";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { toast } from "react-toastify";
import moment from "moment";
import { useRouter } from "next/router";
import AdminProvider from "../../../Data/AdminProvider";

const TableAdmins = ({
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
  const [adminId, setAdminId] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminOpenInfo, setAdminOpenInfo] = useState({});
  const [adminDetails, setAdminDetails] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const columns = [
    {
      title: "№",
      key: "num",
      render: (text, item, i) => (
        <div className="no_wrap">{i + 1 + (page - 1) * pageSize}</div>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      render: (username) => <Typography>{username}</Typography>,
    },
    {
      title: "Полное имя",
      dataIndex: "full_name",
      render: (full_name) => (
        <Typography>{full_name || "Не указано"}</Typography>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => (
        <Typography>{email || 'Не указано'}</Typography>
      ),
    },
    {
      title: "Статус",
      dataIndex: "is_active",
      render: (is_active) => {
        return (
          <Typography>
            {is_active === true ? (
              <span className="badge badge-success">Активный</span>
            ) : (
              <span className="badge badge-danger">Неактивный</span>
            )}
          </Typography>
        );
      },
    },
    {
      title: "Дата создания",
      dataIndex: "date_joined",
      render: (date) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>
            {moment(new Date(date)).format("DD.MM.YYYY")}
          </Typography>
        </div>
      ),
    },
    {
      title: "Действия",
      dataIndex: "id",
      render: (id, data) => (
        <div
          style={{
            minWidth: "150px",
            display: "flex",
            gap: 8,
            justifyContent: "center",
          }}
        >
          <Popover content={"Редактировать"}>
            <Button
              type="primary"
              size="small"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
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

          <Popover content={"Удалить"}>
            <Button
              type="primary"
              size="small"
              danger
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(255, 77, 79, 0.3)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
                setAdminId(id);
              }}
            >
              <DeleteOutlined style={{ fontSize: "16px" }} />
            </Button>
          </Popover>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    AdminProvider.getAllAdmins(page, filters.query)
      .then((res) => {
        setData(res.data.results);
        setTotal(res.data.count);
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
  }, [modalIsOpen, isOpen, page, pageSize, filters]);

  const handleDeleteAdmin = (id) => {
    setConfirmLoading(true);
    AdminProvider.deteleAdmin(id)
      .then((res) => {
        console.log(res);
        toast.success("Администратор удален!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Ошибка");
      })
      .finally(() => {
        setConfirmLoading(false);
        setIsOpen(false);
        setAdminId(null);
      });
  };

  return (
    <div>
      <Table
        {...{
          columns,
          data,
          loading,
          setPage,
          pagination: {
            current: page,
            pageSize: pageSize,
            total: total,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          },
          onRow: (record, rowIndex) => ({
            onClick: () => {
              setAdminOpen(true);
              setAdminOpenInfo(record);
              setAdminLoading(true);
              setAdminDetails(null);
              AdminProvider.getOneAdmin(record.id)
                .then((res) => {
                  setAdminDetails(res.data);
                })
                .catch((err) => {
                  console.log(err);
                  toast.error("Admin ma'lumotlarini yuklashda xatolik");
                })
                .finally(() => {
                  setAdminLoading(false);
                });
            },
          }),
        }}
      />

      <ModalContextProvider modalIsOpen={isOpen} setIsOpen={setIsOpen}>
        <FormModal
          title={"Удалить администратора"}
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
              onClick={() => handleDeleteAdmin(adminId)}
              loading={confirmLoading}
            >
              Продолжить
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>

      <ModalContextProvider modalIsOpen={adminOpen} setIsOpen={setAdminOpen}>
        <FormModal
          title={"Информация об администраторе"}
          handleCancel={() => setAdminOpen(false)}
          width={"750px"}
        >
          {adminLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <Spin />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <Typography style={{ fontWeight: 600, marginBottom: 8 }}>
                  Основная информация:
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>ID:</strong> {adminDetails?.id || adminOpenInfo.id}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Username:</strong>{" "}
                  {adminDetails?.username || adminOpenInfo.username}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Полное имя:</strong>{" "}
                  {adminDetails?.full_name || adminOpenInfo.full_name || "Не указано"}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Email:</strong>{" "}
                  {adminDetails?.email || adminOpenInfo.email || "Не указано"}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Дата регистрации:</strong>{" "}
                  {adminDetails?.date_joined
                    ? moment(new Date(adminDetails.date_joined)).format(
                      "DD.MM.YYYY HH:mm"
                    )
                    : adminOpenInfo.date_joined
                      ? moment(new Date(adminOpenInfo.date_joined)).format(
                        "DD.MM.YYYY HH:mm"
                      )
                      : "Неизвестно"}
                </Typography>
              </div>
            </>
          )}
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button type="primary" onClick={() => setAdminOpen(false)}>
              OK
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
    </div>
  );
};

export default TableAdmins;