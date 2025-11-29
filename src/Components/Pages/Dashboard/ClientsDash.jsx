import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CategoryProvider from "../../../Data/CategoryProvider";
import BookingProvider from "../../../Data/BookingProvider";

const ClientsDashWrapper = styled.div`
  .table-container {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
  }

  .table-header {
    background: #3b82f6;
    color: white;
    padding: 16px 20px;
    text-align: center;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  .table-responsive {
    overflow-x: auto;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
      
      &:hover {
        background: #94a3b8;
      }
    }
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
    
    thead {
      background: #f8fafc;
      
      th {
        padding: 12px 16px;
        text-align: center;
        font-weight: 600;
        color: #374151;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #e5e7eb;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: #3b82f6;
          transition: width 0.2s ease;
        }
        
        &:hover::after {
          width: 80%;
        }
      }
    }
    
    tbody {
      tr {
        transition: all 0.2s ease;
        border-bottom: 1px solid #f3f4f6;
        
        &:hover {
          background: #f9fafb;
          transform: scale(1.005);
        }
        
        &:last-child {
          border-bottom: none;
        }
        
        th, td {
          padding: 12px 16px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        
        th {
          background: #f8fafc;
          color: #3b82f6;
          font-weight: 600;
          border-radius: 6px 0 0 6px;
        }
        
        td {
          &:nth-child(2) {
            font-weight: 600;
            color: #374151;
          }
          
          &:nth-child(3),
          &:nth-child(4) {
            font-weight: 600;
            color: #3b82f6;
          }
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 15px;
      opacity: 0.5;
    }
    
    .empty-text {
      font-size: 16px;
      font-weight: 500;
    }
  }

  @media (max-width: 768px) {
    .table-header {
      padding: 12px 16px;
      
      h3 {
        font-size: 15px;
      }
    }
    
    .table {
      thead th {
        padding: 10px 12px;
        font-size: 12px;
      }
      
      tbody th, tbody td {
        padding: 10px 12px;
        font-size: 13px;
      }
    }
  }
`;

const ClientsDash = () => {
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Fetch categories
    CategoryProvider.getAllCategory()
      .then((categoriesRes) => {
        const categoriesData = categoriesRes?.data;
        if (Array.isArray(categoriesData?.results)) {
          setCategories(categoriesData.results);
          return;
        }
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
          return;
        }
        setCategories([]);
      })
      .catch((err) => {
        console.log(err);
      });

    // Fetch all bookings (handle pagination)
    const fetchAllBookings = async () => {
      try {
        let allBookings = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
          const bookingsRes = await BookingProvider.getAllBookings('', '', '', '', '', currentPage);
          const bookingsData = bookingsRes?.data;
          
          let pageBookings = [];
          if (Array.isArray(bookingsData?.results)) {
            pageBookings = bookingsData.results;
            // Check if there are more pages
            const total = bookingsData.count || bookingsData.total || 0;
            const pageSize = bookingsData.results.length;
            hasMore = allBookings.length + pageSize < total && pageBookings.length > 0;
          } else if (Array.isArray(bookingsData)) {
            pageBookings = bookingsData;
            hasMore = false; // If it's a direct array, assume no pagination
          }

          allBookings = [...allBookings, ...pageBookings];
          
          if (pageBookings.length === 0) {
            hasMore = false;
          } else {
            currentPage++;
          }
        }

        setBookings(allBookings);
      } catch (err) {
        console.log(err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  const resolveListingCount = (category) =>
    category?.listing_count ??
    category?.active_count ??
    category?.ads_count ??
    category?.count ??
    0;

  const resolveBookingCount = (category) => {
    if (!category || !bookings || bookings.length === 0) {
      return 0;
    }

    const categoryId = category?.id;
    const categoryName = resolveCategoryName(category, 0);
    
    // Filter bookings by category
    const categoryBookings = bookings.filter((booking) => {
      const listing = booking?.listing;
      if (!listing) return false;

      // Check by category ID first (most reliable)
      if (categoryId && (listing?.category_id === categoryId || listing?.category?.id === categoryId)) {
        return true;
      }

      // Check by category name (string comparison)
      const bookingCategory = listing?.category;
      if (bookingCategory) {
        // If bookingCategory is a string
        if (typeof bookingCategory === 'string') {
          return (
            bookingCategory === categoryName ||
            bookingCategory === category?.name ||
            bookingCategory === category?.name_uz ||
            bookingCategory === category?.name_ru ||
            bookingCategory === category?.title ||
            bookingCategory === category?.title_uz ||
            bookingCategory === category?.title_ru
          );
        }
        // If bookingCategory is an object
        if (typeof bookingCategory === 'object') {
          return (
            bookingCategory?.name === categoryName ||
            bookingCategory?.name === category?.name ||
            bookingCategory?.name_uz === category?.name_uz ||
            bookingCategory?.name_ru === category?.name_ru ||
            bookingCategory?.id === categoryId
          );
        }
      }

      return false;
    });

    return categoryBookings.length;
  };

  const resolveCategoryName = (category, idx) => {
    if (!category) {
      return `Kategoriya ${idx + 1}`;
    }

    return (
      category?.name ||
      category?.name_uz ||
      category?.name_ru ||
      category?.title ||
      category?.title_uz ||
      category?.title_ru ||
      category?.translation?.name ||
      category?.translations?.name ||
      `Kategoriya ${idx + 1}`
    );
  };

  if (loading) {
    return (
      <ClientsDashWrapper>
        <div className="empty-state">
          <div className="empty-text">Загрузка данных...</div>
        </div>
      </ClientsDashWrapper>
    );
  }

  return (
    <ClientsDashWrapper>
      <div className="table-container">
        <div className="table-header">
          <h3>Количество объявлений по категориям</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Название категории</th>
                <th scope="col">Количество объявлений</th>
                <th scope="col">Количество бронирований</th>
              </tr>
            </thead>
            <tbody>
              {categories?.length > 0 ? (
                categories.map((category, i) => (
                  <tr key={category?.id || i}>
                    <th scope="row">{i + 1}</th>
                    <td>{resolveCategoryName(category, i)}</td>
                    <td>{resolveListingCount(category)}</td>
                    <td>{resolveBookingCount(category)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <div className="empty-text">Ma'lumotlar mavjud emas</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ClientsDashWrapper>
  );
};

export default ClientsDash;
