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
import { useTranslation } from "../../../hooks/useTranslation";

const TableListings = ({
  modalIsOpen,
  setModalIsOpen,
  setClientData,
  setId,
  filters,
}) => {
  const { t } = useTranslation();
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
      title: t('table.number'),
      key: "num",
      render: (text, item, i) => (
        <div className="no_wrap">{(page - 1) * pageSize + i + 1}</div>
      ),
    },
    {
      title: t('table.title'),
      dataIndex: "title",
      render: (title) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{title}</Typography>
        </div>
      ),
    },
    {
      title: t('table.owner'),
      dataIndex: "owner_full_name",
      render: (owner_full_name) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{owner_full_name}</Typography>
        </div>
      ),
    },
    {
      title: t('table.status'),
      dataIndex: "status",
      render: (status) => (
        <div style={{ minWidth: "150px", display: "flex", justifyContent: "start" }}>
          {status === 'pending' && (
            <span className="badge badge-warning">
              <span className="badge-dot"></span>
              {t('status.pending')}
            </span>
          )}
          {status === 'active' && (
            <span className="badge badge-success">
              <span className="badge-dot"></span>
              {t('status.active')}
            </span>
          )}
          {status === 'rejected' && (
            <span className="badge badge-danger">
              <span className="badge-dot"></span>
              {t('status.rejected')}
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
      title: t('table.created_date'),
      dataIndex: "created_at",
      render: (date) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{moment(new Date(date)).format("DD.MM.YYYY")}</Typography>
        </div>
      ),
    },
    // },
    {
      title: t('table.actions'),
      dataIndex: "id",
      render: (id, data) => (
        <div style={{ minWidth: "150px", display: "flex", gap: 8, justifyContent: "center" }}>
          <Popover content={(
            <div>
              <p style={{ textAlign: 'center' }}>{t('buttons.activate')}</p>
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
              <p style={{ textAlign: 'center' }}>{t('buttons.reject')}</p>
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
        toast.success(t('messages.success.listing_deleted'));
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
        toast.success(t('messages.success.listing_approved'));
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
        toast.success(t('messages.success.listing_rejected'));
        setIsOpen3(false);
        form.resetFields();
        setReason('');
      })
      .catch((err) => {
        console.log(err);
        toast.error("Xatolik");
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
                  console.log("getOneListing response:", res.data);
                  setListingOpenInfo(res.data);
                })
                .catch((err) => {
                  console.error("getOneListing error:", err);
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
          title={"E'lon o'chirish"}
          handleCancel={() => setIsOpen(false)}
          width={"450px"}
        >
          <Typography style={{ marginBottom: 20 }}>
            Haqiqatdan o'chirishni xoxlaysizmi?
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
              onClick={() => handleDeleteClients(listingId)}
              loading={confirmLoading}
            >
              Davom etish
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
      <ModalContextProvider modalIsOpen={isOpen2} setIsOpen={setIsOpen2}>
        <FormModal
          title={"E'lonni faollashtirish"}
          handleCancel={() => setIsOpen2(false)}
          width={"450px"}
        >
          <Typography style={{ marginBottom: 20 }}>
            Haqiqatdan e'lon faollashtirilsinmi?
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
              onClick={() => handleApprovedListing(listingId, listingData)}
              loading={confirmLoading}
            >
              Davom etish
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
      <ModalContextProvider modalIsOpen={isOpen3} setIsOpen={setIsOpen3}>
        <FormModal
          title={"E'lonni rad qilish"}
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
              Haqiqatdan rad qilinsinmi?
            </Typography>
            <Form.Item
              label="Nima sababdan"
              name="reason"
              rules={[
                {
                  required: true,
                  message: "Iltimos, sababni kiriting!",
                },
              ]}
            >
              <Input 
                placeholder="Sababi"
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
                Orqaga
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={confirmLoading}
              >
                Davom etish
              </Button>
            </div>
          </Form>
        </FormModal>
      </ModalContextProvider>

      <ModalContextProvider modalIsOpen={listingOpen} setIsOpen={setListingOpen}>
        <FormModal
          title={"E'lon haqida"}
          handleCancel={() => setListingOpen(false)}
          width={"750px"}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Typography>Ma'lumotlar yuklanmoqda...</Typography>
            </div>
          ) : (
            <>
              <Typography style={{ marginBottom: 20 }}>
                E'lon nomi - {listingOpenInfo.title}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                E'lon haqida - {listingOpenInfo.description}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                E'lon egasi raqami - {listingOpenInfo.owner_phone}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Narxlar(Soatlik/Kunlik/Oylik) - {listingOpenInfo.price_per_hour}/{listingOpenInfo.price_per_day}/{listingOpenInfo.price_per_month}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                E'lon kategoriyasi - {listingOpenInfo.category_name}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Yaratilgan sana -{" "}
                {moment(new Date(listingOpenInfo.created_at)).format("DD.MM.YYYY")}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Ko'rilganlar soni - {listingOpenInfo.views_count}
              </Typography>

              <Typography style={{ marginBottom: 20 }}>
                Rasmlar <br /> {listingOpenInfo?.photos?.map((item, index)=>(
                  <Image width={100} height={100} style={{objectFit:'contain'}} src={item.url} alt={item.id}/>
                ))}
              </Typography>
            </>
          )}

          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button type="primary" onClick={() => setListingOpen(false)}>
              Ok
            </Button>
          </div>
        </FormModal>
      </ModalContextProvider>
    </div>
  );
};

export default TableListings;
