import React, { useEffect, useState } from "react";
import Table from "../../Common/Table/Table";
import { Button, Form, Image, Input, Popover, Typography } from "antd";
import { CheckCircleOutline, DeleteOutlined, EditOutlined, Restore } from "@mui/icons-material";
import { ModalContextProvider } from "../../../Context/ModalContext";
import FormModal from "../../Common/FormModal";
import { toast } from "react-toastify";
import moment from "moment";
import { useRouter } from "next/router";
import ListingProvider from "../../../Data/ListingProvider";

const TableListings = ({
  modalIsOpen,
  setModalIsOpen,
  setClientData,
  setId,
  filters,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [listingData, setListingData] = useState({});
  const [reason, setReason] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [listingId, setListingId] = useState(null);
  const [listingOpen, setListingOpen] = useState(false);
  const [listingOpenInfo, setListingOpenInfo] = useState({});
  const pageSize = 20;
  const columns = [
    {
      title: "№",
      key: "num",
      render: (text, item, i) => (
        <div className="no_wrap">{(page - 1) * pageSize + i + 1}</div>
      ),
    },
    {
      title: "Заголовок",
      dataIndex: "title",
      render: (title) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{title}</Typography>
        </div>
      ),
    },
    {
      title: "Категория",
      dataIndex: "category_name",
      render: (title) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{title}</Typography>
        </div>
      ),
    },
    {
      title: "Владелец объявления",
      dataIndex: "owner_full_name",
      render: (owner_full_name) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{owner_full_name}</Typography>
        </div>
      ),
    },
    {
      title: "Телефон владельца",
      dataIndex: "owner_phone",
      render: (owner_phone) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{owner_phone}</Typography>
        </div>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (status) => (
        <div style={{ minWidth: "150px", display: "flex", justifyContent: "start" }}>
          {status === 'pending' && (
            <span className="badge badge-warning">
              <span className="badge-dot"></span>
              {"Ожидает"}
            </span>
          )}
          {status === 'active' && (
            <span className="badge badge-success">
              <span className="badge-dot"></span>
              {"Активный"}
            </span>
          )}
          {status === 'rejected' && (
            <span className="badge badge-danger">
              <span className="badge-dot"></span>
              {"Отклонено"}
            </span>
          )}
          {!['pending', 'active', 'rejected'].includes(status) && (
            <span className="badge badge-secondary">
              <span className="badge-dot"></span>
              {status}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Дата создания",
      dataIndex: "created_at",
      render: (date) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{moment(new Date(date)).format("DD.MM.YYYY")}</Typography>
        </div>
      ),
    },
    // },
    {
      title: "Действия",
      dataIndex: "id",
      render: (id, data) => (
        <div style={{ minWidth: "150px", display: "flex", gap: 8, justifyContent: "center" }}>
          <Popover content={(
            <div>
              <p style={{ textAlign: 'center' }}>Активировать</p>
            </div>
          )} title="">
            <Button
              type="primary"
              size="small"
              danger
              style={{
                background: 'rgba(77, 255, 122, 0.67)',
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(77, 255, 86, 0.67)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen2(true);
                setListingId(id);
                setListingData(data)
              }}
            >
              <CheckCircleOutline style={{ fontSize: "16px", color: '#000' }} />
            </Button>
          </Popover>
          <Popover content={(
            <div>
              <p style={{ textAlign: 'center' }}>Отклонить</p>
            </div>
          )} title="">
            <Button
              type="primary"
              size="small"
              danger
              style={{
                background: 'rgba(255, 228, 77, 0.67)',
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(255, 228, 77, 0.67)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen3(true);
                setListingId(id);
                setListingData(data)
              }}
            >
              <Restore style={{ fontSize: "16px", color: '#000' }} />
            </Button>
          </Popover>
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
                setListingId(id);
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
    setPage(1); // filter o'zgarsa, 1-sahifaga qaytadi
  }, [filters]);

  useEffect(() => {
    console.log('filters', filters);
    
    const { query = '', category_id = '', status = '', user_id = '' } = filters || {};
    setLoading(true);
    ListingProvider.getAllListing(category_id, status, page, query, user_id)
      .then((res) => {
        setData(res.data.results || res.data);
        setTotal(res.data.count || res.data.total || 0);
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
  }, [modalIsOpen, isOpen, isOpen2, isOpen3, filters, page]);

  const handleDeleteClients = (id) => {
    setConfirmLoading(true);
    ListingProvider.deteleListing(id)
      .then((res) => {
        console.log(res);
        toast.success("Объявление удалено!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("O'chirishda xatolik");
      })
      .finally(() => {
        setConfirmLoading(false);
        setIsOpen(false);
      });
  };
  const handleApprovedListing = (id, listingData) => {
    setConfirmLoading(true);
    ListingProvider.approveListing(id, listingData)
      .then((res) => {
        console.log(res);
        toast.success("Объявление одобрено");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Xatolik");
      })
      .finally(() => {
        setConfirmLoading(false);
        setIsOpen2(false);
      });
  };
  const handleRejectListing = (id, listingData, formValues) => {
    setConfirmLoading(true);
    ListingProvider.rejectListing(id, { ...listingData, reason: formValues?.reason || reason })
      .then((res) => {
        console.log(res);
        toast.success("Объявление отклонено");
        setIsOpen3(false);
        form.resetFields();
        setReason('');
      })
      .catch((err) => {
        console.log(err);
        toast.error("Ошибка");
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const handleChange = (e) => {
    setReason(e.target?.value);
  };

  // Table komponentiga uzatiladigan setPage funksiyasini o‘zgartiramiz:
  const handleSetPage = (p) => {
    setLoading(true);
    setPage(p);
  };

  return (
    <div>
      <Table
        columns={columns}
        data={data}
        loading={loading}
        pagination={{
          current: page,
          total: total,
          pageSize: pageSize,
        }}
        setPage={handleSetPage}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              setListingOpen(true);
              setListingOpenInfo({}); // Avval tozalash
              setLoading(true);
              
              // getOneListing API dan foydalanish
              ListingProvider.getOneListing(record.id)
                .then((res) => {
                  setListingOpenInfo(res.data);
                })
                .catch((err) => {
                  if (err.response?.status == 401) {
                    router.push("/login");
                  }
                })
                .finally(() => {
                  setLoading(false);
                });
            },
          };
        }}
      />

      <ModalContextProvider modalIsOpen={isOpen} setIsOpen={setIsOpen}>
        <FormModal
          title={"Удалить объявление"}
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
              onClick={() => handleDeleteClients(listingId)}
              loading={confirmLoading}
            >
              Продолжить
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
      <ModalContextProvider modalIsOpen={isOpen2} setIsOpen={setIsOpen2}>
        <FormModal
          title={"Активировать объявление"}
          handleCancel={() => setIsOpen2(false)}
          width={"450px"}
        >
          <Typography style={{ marginBottom: 20 }}>
            Вы действительно хотите активировать объявление?
          </Typography>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={() => setIsOpen2(false)}
              style={{ marginRight: 20 }}
            >
              Назад
            </Button>
            <Button
              type="primary"
              onClick={() => handleApprovedListing(listingId, listingData)}
              loading={confirmLoading}
            >
              Продолжить
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
      <ModalContextProvider modalIsOpen={isOpen3} setIsOpen={setIsOpen3}>
        <FormModal
          title={"Отклонить объявление"}
          handleCancel={() => {
            setIsOpen3(false);
            form.resetFields();
            setReason('');
          }}
          width={"450px"}
        >
          <Form
            form={form}
            onFinish={(values) => handleRejectListing(listingId, listingData, values)}
            layout="vertical"
          >
            <Typography style={{ marginBottom: 20 }}>
              Вы действительно хотите отклонить?
            </Typography>
            <Form.Item
              label="Причина"
              name="reason"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, укажите причину!",
                },
              ]}
            >
              <Input 
                placeholder="Причина"
                value={reason}
                onChange={handleChange} 
              />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button
                onClick={() => {
                  setIsOpen3(false);
                  form.resetFields();
                  setReason('');
                }}
                style={{ marginRight: 20 }}
              >
                Назад
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={confirmLoading}
              >
                Продолжить
              </Button>
            </div>
          </Form>
        </FormModal>
      </ModalContextProvider>

      <ModalContextProvider modalIsOpen={listingOpen} setIsOpen={setListingOpen}>
        <FormModal
          title={"Информация об объявлении"}
          handleCancel={() => setListingOpen(false)}
          width={"750px"}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Typography>Данные загружаются...</Typography>
            </div>
          ) : (
            <>
              <Typography style={{ marginBottom: 20 }}>
                Название объявления - {listingOpenInfo.title}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Описание объявления - {listingOpenInfo.description}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Номер владельца - {listingOpenInfo.owner_phone}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Цены (Почасово/Посуточно/Помесечно) - {listingOpenInfo.price_per_hour}/{listingOpenInfo.price_per_day}/{listingOpenInfo.price_per_month}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Категория объявления - {listingOpenInfo.category_name}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Дата создания -{" "}
                {moment(new Date(listingOpenInfo.created_at)).format("DD.MM.YYYY")}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Количество просмотров - {listingOpenInfo.views_count}
              </Typography>

              <Typography style={{ marginBottom: 20 }}>
                Фотографии <br /> {listingOpenInfo?.photos?.map((item, index)=>(
                  <Image width={100} height={100} style={{objectFit:'contain'}} src={item.url} alt={item.id}/>
                ))}
              </Typography>
            </>
          )}

          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button type="primary" onClick={() => setListingOpen(false)}>
              ОК
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
    </div>
  );
};

export default TableListings;
