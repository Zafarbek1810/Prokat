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
import BookingProvider from "../../../Data/BookingProvider";

const TableBooking = ({
  modalIsOpen,
  setModalIsOpen,
  setClientData,
  setId,
  filters,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
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
      title: "Объявление",
      dataIndex: "listing",
      render: (title) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{title.title}</Typography>
        </div>
      ),
    },
    {
      title: "Категория",
      dataIndex: "listing",
      render: (title) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{title.category}</Typography>
        </div>
      ),
    },
    {
      title: "Арендатор",
      dataIndex: "renter",
      render: (renter) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{renter}</Typography>
        </div>
      ),
    },
    {
      title: "Владелец",
      dataIndex: "owner",
      render: (owner) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{owner}</Typography>
        </div>
      ),
    },
    {
      title: "Тип аренды",
      dataIndex: "rental_type",
      render: (rental_type) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{rental_type === 'hourly' ? 'Почасовой' : 'Ежедневно'}</Typography>
        </div>
      ),
    },
    {
      title: "Время начала",
      dataIndex: "start_time",
      render: (date) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{moment(new Date(date)).format("DD.MM.YYYY HH:MM")}</Typography>
        </div>
      ),
    },
    {
      title: "Время окончания",
      dataIndex: "end_time",
      render: (date) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{moment(new Date(date)).format("DD.MM.YYYY HH:MM")}</Typography>
        </div>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (date) => (
        <div style={{ minWidth: "150px" }}>
          <Typography>{status === 'pending' ? 'Почасовой' : 'Ежедневно'}</Typography>
        </div>
      ),
    },
  ];


  useEffect(() => {
    setPage(1); // filter o'zgarsa, 1-sahifaga qaytadi
  }, [filters]);

  useEffect(() => {
    console.log('filters', filters);

    const { status = '', ordering = '', payment_type = '', rental_type = '', search = '' } = filters || {};
    setLoading(true);
    BookingProvider.getAllBookings(status, ordering, payment_type, rental_type, search, page)
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
  }, [modalIsOpen, filters, page]);

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
              BookingProvider.getOneBooking(record.id)
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
                Название объявления - {listingOpenInfo.listing?.title}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Категория объявления- {listingOpenInfo.listing?.category}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Номер владельца - {listingOpenInfo.owner}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Номер aрендатор - {listingOpenInfo.renter}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Тип аренды  - {listingOpenInfo.rental_type === 'hourly' ? 'Почасовой' : 'Ежедневно'}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Цены  - {listingOpenInfo.total_price}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Время начала -{" "}
                {moment(new Date(listingOpenInfo.start_time)).format("DD.MM.YYYY HH:MM")}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Время окончания -{" "}
                {moment(new Date(listingOpenInfo.end_time)).format("DD.MM.YYYY HH:MM")}
              </Typography>
              <Typography style={{ marginBottom: 20 }}>
                Статус - {listingOpenInfo.status === 'pending' ? 'Ожидает' : (listingOpenInfo.status === 'confirmed' ? 'Подтвержденный': (listingOpenInfo.status === 'completed' ? 'Завершенный' : 'Отменено'))}
              </Typography>

              <Typography style={{ marginBottom: 20 }}>
                Фотографии <br /> {listingOpenInfo?.listing?.photos?.map((item, index) => (
                  <Image width={100} height={100} style={{ objectFit: 'contain' }} src={item.url} alt={item.id} />
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

export default TableBooking;
