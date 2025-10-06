import React, { useEffect, useState } from "react";
import Table from "../../Common/Table/Table";
import { Button, Image, Input, Popover, Typography } from "antd";
import { Spin } from "antd";
import {
  BlockSharp,
  DeleteOutlined,
  EditOutlined,
  LockOpen,
  LockOutlined,
} from "@mui/icons-material";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { toast } from "react-toastify";
import moment from "moment";
import { useRouter } from "next/router";
import UserProvider from "../../../Data/UserProvider";
import { useTranslation } from "../../../hooks/useTranslation";

const TableUsers = ({
  modalIsOpen,
  setModalIsOpen,
  setClientData,
  setId,
  filters,
  isBlocked
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [clientOpen, setClientOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [reason, setReason] = useState({});
  const [userOpenInfo, setUserOpenInfo] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const columns = [
    {
      title: "№",
      key: "num",
      render: (text, item, i) => (
        <div className="no_wrap">{i + 1 + 0 * 10}</div>
      ),
    },
    {
      title: t('table.full_name'),
      dataIndex: "full_name",
      render: (full_name) => <Typography>{full_name == "" ? t('status.not_entered') : full_name}</Typography>,
    },
    {
      title: t('table.phone_number'),
      dataIndex: "phone_number",
      render: (phone_number) => <Typography>{phone_number}</Typography>,
    },
    {
      title: t('table.status'),
      dataIndex: "is_blocked",
      render: (is_blocked, data) => {
        return (
          <Typography>
            {data.is_blocked === true ? <span className="badge badge-danger">{t('status.blocked')}</span> : <span className="badge badge-success">{t('status.unblocked')}</span>}
          </Typography>
        );
      },
    },
    {
      title: t('table.created_date'),
      dataIndex: "date_joined",
      render: (date) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{moment(new Date(date)).format("DD.MM.YYYY")}</Typography>
        </div>
      ),
    },
    {
      title: t('table.actions'),
      dataIndex: "id",
      render: (id, data) => (
        <div style={{ minWidth: "150px", display: "flex", gap: 8, justifyContent: "center" }}>
          {data.is_blocked ? (
            <Button
              type="primary"
              size="small"
              style={{
                background: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(86, 171, 47, 0.3)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen2(true);
                setUserId(id);
                setUserInfo(data);
              }}
            >
              <Popover content={"Blokdan ochish"}>
                <LockOpen style={{ fontSize: "16px" }} />
              </Popover>
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              style={{
                background: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(255, 65, 108, 0.3)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen2(true);
                setUserId(id);
                setUserInfo(data);
              }}
            >
              <Popover content={"Bloklash"}>
                <LockOutlined style={{ fontSize: "16px" }} />
              </Popover>
            </Button>
          )}

          <Popover content={(
            <div>
              <p style={{ textAlign: 'center' }}>O'chirish</p>
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
              setUserId(id);
            }}
          >
            <DeleteOutlined style={{ fontSize: "16px" }} />
          </Button>
          </Popover>
          {/* <Popover content={(
            <div>
              <p style={{ textAlign: 'center' }}>Taxrirlash</p>
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
          </Popover> */}
          
          
        </div>
      ),
    },
  ];

  useEffect(() => {

    setLoading(true);
    UserProvider.getAllUsers(
      isBlocked, 
      page, 
      filters.phone_number || "", 
      filters.full_name || "", 
      filters.listings_count || "", 
      filters.address || ""
    )
      .then((res) => {
        setData(res.data.results);
        setTotal(res.data.count); // count yoki total bo'lishi mumkin, API javobiga qarab
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
  }, [modalIsOpen, isOpen, isOpen2, filters, isBlocked, page, pageSize]);

  const handleDeleteUser = (id) => {
    setConfirmLoading(true);
    UserProvider.deteleUser(id)
      .then((res) => {
        console.log(res);
        toast.success(t('messages.success.user_deleted'));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Xatolik!");
      })
      .finally(() => {
        setConfirmLoading(false);
        setIsOpen(false);
        setUserId(null);
      });
  };
  const handleBlockUser = (id) => {
    setConfirmLoading(true);
    let body = {
      reason: reason,
    };
    UserProvider.blockUser(id, body)
      .then((res) => {
        toast.success(t('messages.success.user_blocked'));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Xatolik!");
      })
      .finally(() => {
        setConfirmLoading(false);
        setIsOpen2(false);
        setUserId(null);
      });
  };
  const handleUnblockUser = (id) => {
    setConfirmLoading(true);
    UserProvider.unblockUser(id)
      .then((res) => {
        toast.success(t('messages.success.user_unblocked'));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Xatolik!");
      })
      .finally(() => {
        setConfirmLoading(false);
        setIsOpen2(false);
        setUserId(null);
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
              setClientOpen(true);
              setUserOpenInfo(record);
              setClientLoading(true);
              setUserDetails(null);
              UserProvider.getOneUser(record.id)
                .then((res) => {
                  setUserDetails(res.data);
                })
                .catch((err) => {
                  console.log(err);
                  toast.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik");
                })
                .finally(() => {
                  setClientLoading(false);
                });
            },
          }),
        }}
      />

      <ModalContextProvider modalIsOpen={isOpen} setIsOpen={setIsOpen}>
        <FormModal
          title={"Foydalanuvchi o'chirish"}
          handleCancel={() => setIsOpen(false)}
          width={"450px"}
        >
          <Typography style={{ marginBottom: 20 }}>
            Haqiqatdan o'chirmoqchimisiz?
          </Typography>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={() => setIsOpen(false)}
              style={{ marginRight: 20 }}
            >
              Orqaga
            </Button>
            <Button
              type="primary"
              onClick={() => handleDeleteUser(userId)}
              loading={confirmLoading}
            >
              Davom etish
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
      <ModalContextProvider modalIsOpen={isOpen2} setIsOpen={setIsOpen2}>
        <FormModal
          title={userInfo.is_blocked ? "Blokdan chiqarish" : "Bloklash"}
          handleCancel={() => setIsOpen(false)}
          width={"450px"}
        >
          <Typography style={{ marginBottom: 20 }}>
            {userInfo.is_blocked
              ? "Haqiqatdan blokdan chiqarmoqchimisiz?"
              : "Haqiqatdan bloklamoqchimisiz?"}
          </Typography>
          <Typography style={{ marginBottom: 20 }}>
            {userInfo.is_blocked ? (
              <></>
            ) : (
              <Input
                placeholder="Sababi"
                onChange={(e) => setReason(e.target.value)}
              />
            )}
          </Typography>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={() => setIsOpen2(false)}
              style={{ marginRight: 20 }}
            >
              Orqaga
            </Button>
            <Button
              type="primary"
              onClick={
                userInfo.is_blocked
                  ? () => handleUnblockUser(userId)
                  : () => handleBlockUser(userId)
              }
              loading={confirmLoading}
            >
              Davom etish
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>

      <ModalContextProvider modalIsOpen={clientOpen} setIsOpen={setClientOpen}>
        <FormModal
          title={"Foydalanuvchi haqida"}
          handleCancel={() => setClientOpen(false)}
          width={"750px"}
        >
          {clientLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
              <Spin />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <Typography style={{ fontWeight: 600, marginBottom: 8 }}>Asosiy ma'lumotlar:</Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>ID:</strong> {userDetails?.id || userOpenInfo.id}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Telefon raqami:</strong> {userDetails?.phone_number || userOpenInfo.phone_number}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>To'liq ism:</strong> {userDetails?.full_name || "Kiritilmagan"}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Email:</strong> {userDetails?.email || "Kiritilmagan"}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Manzil:</strong> {userDetails?.address || "Kiritilmagan"}
                </Typography>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Typography style={{ fontWeight: 600, marginBottom: 8 }}>Holat va faoliyat:</Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Faol:</strong> {userDetails?.is_active ? "Ha" : "Yo'q"}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Bloklangan:</strong> {(userDetails?.is_blocked ?? userOpenInfo.is_blocked) ? "Ha" : "Yo'q"}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Reyting:</strong> {userDetails?.rating || 0}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Rol:</strong> {userDetails?.role || "user"}
                </Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Faol e'lonlar soni:</strong> {userDetails?.active_listings_count || 0}
                </Typography>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Typography style={{ fontWeight: 600, marginBottom: 8 }}>Tarix:</Typography>
                <Typography style={{ marginBottom: 8 }}>
                  <strong>Ro'yxatdan o'tgan sana:</strong> {userDetails?.date_joined ? moment(new Date(userDetails.date_joined)).format("DD.MM.YYYY HH:mm") : "Ma'lum emas"}
                </Typography>
              </div>

              {userDetails?.avatar && (
                <div style={{ marginBottom: 16 }}>
                  <Typography style={{ fontWeight: 600, marginBottom: 8 }}>Avatar:</Typography>
                  <Image
                    src={userDetails.avatar}
                    alt="Avatar"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                  />
                </div>
              )}
            </>
          )}
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

export default TableUsers;
