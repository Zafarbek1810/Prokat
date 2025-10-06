import React, { useEffect, useState } from "react";
import Table from "../../Common/Table/Table";
import { Button, Image, Input, Popover, Typography } from "antd";
import {
  ArchiveOutlined,
  BlockSharp,
  DeleteOutlined,
  EditOutlined,
  LockOpen,
  LockOutlined,
} from "@mui/icons-material";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import ChatDetail from "./ChatDetail";
import { toast } from "react-toastify";
import moment from "moment";
import { useRouter } from "next/router";
import UserProvider from "../../../Data/UserProvider";
import ChatProvider from "../../../Data/ChatProvider";
import { useTranslation } from "../../../hooks/useTranslation";

const TableChat = ({
  modalIsOpen,
  setModalIsOpen,
  setClientData,
  setId,
  filters,
  isArchived
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [clientOpen, setClientOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [reason, setReason] = useState({});
  const [userOpenInfo, setUserOpenInfo] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [chatDetailOpen, setChatDetailOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const columns = [
    {
      title: "№",
      key: "num",
      render: (text, item, i) => (
        <div className="no_wrap">{i + 1 + 0 * 10}</div>
      ),
    },
    {
      title: t('table.participants'),
      dataIndex: "participant_phones",
      render: (participant_phones) => <Typography>{participant_phones[0]}, {participant_phones[1]}</Typography>,
    },
    {
      title: t('table.flag_count'),
      dataIndex: "flag_count  ",
      render: (flag_count, data) => {
        console.log(data);
        return (
          <Typography>
            {data.flag_count}
          </Typography>
        );
      },
    },
    {
      title: t('table.archived_status'),
      dataIndex: "is_archived",
      render: (is_archived, data) => {
        return (
          <Typography>
            {data.is_archived === true ? <span className="badge badge-warning">{t('status.archived')}</span> : <span className="badge badge-success">{t('status.unarchived')}</span>}
          </Typography>
        );
      },
    },
    {
      title: t('table.created_date'),
      dataIndex: "created_at",
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
        <div style={{ minWidth: "150px", display: "flex", gap: 8, justifyContent: "start" }}>
          {data.is_archived ? (
            <></>
          ) : (
            <Button
              type="primary"
              size="small"
              style={{
                background: "linear-gradient(135deg, #fbd193ff 0%, #f5e557ff 100%)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(251, 227, 147, 0.3)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen2(true);
                setUserId(id);
                setUserInfo(data);
              }}
            >
              <Popover content={"Arxivlash"}>
                <ArchiveOutlined style={{ fontSize: "16px" }} />
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
        </div>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    ChatProvider.getAllChats(isArchived, page)
      .then((res) => {
        setData(res.data.results);
        setTotal(res.data.count); // count yoki total bo‘lishi mumkin, API javobiga qarab
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
  }, [modalIsOpen, isOpen, isOpen2, isOpen3, filters, isArchived, page, pageSize]);

  const handleDeleteChat = (id) => {
    setConfirmLoading(true);
    ChatProvider.deleteChats(id)
      .then((res) => {
        console.log(res);
        toast.success("Chat o'chirildi!");
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
  const handleBlockChat = (id) => {
    setConfirmLoading(true);
    let body = {
      is_archived: true,
    };
    ChatProvider.blockChat(id, body)
      .then((res) => {
        toast.success("Chat arxivlandi");
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
              setSelectedChat(record);
              setChatDetailOpen(true);
            },
          }),
        }}
      />

      <ModalContextProvider modalIsOpen={isOpen} setIsOpen={setIsOpen}>
        <FormModal
          title={"Chatni o'chirish"}
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
              onClick={() => handleDeleteChat(userId)}
              loading={confirmLoading}
            >
              Davom etish
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
      <ModalContextProvider modalIsOpen={isOpen2} setIsOpen={setIsOpen2}>
        <FormModal
          title={'Arxivlash'}
          handleCancel={() => setIsOpen2(false)}
          width={"450px"}
        >
          <Typography style={{ marginBottom: 20 }}>
            {"Haqiqatdan arxivlamoqchimisiz?"}
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
              onClick={() => handleBlockChat(userId)}
              loading={confirmLoading}
            >
              Davom etish
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>

      <ChatDetail
        isOpen={chatDetailOpen}
        setIsOpen={setChatDetailOpen}
        chatId={selectedChat?.id}
        participantPhones={selectedChat?.participant_phones}
        flagCount={selectedChat?.flag_count}
        isArchived={selectedChat?.is_archived}
      />
    </div>
  );
};

export default TableChat;
