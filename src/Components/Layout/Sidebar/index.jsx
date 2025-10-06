import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MyLink from "../../Common/MyLink";
import { SidebarWrapper } from "./Sidebar.style";
import UserProvider from "../../../Data/UserProvider";
import {  Badge } from "antd";

const NavListMenu = [
  //admin role
  {
    title: "Statistika",
    path: "/dashboard/admin/adminStatistika",
    src: "/icons/trend.png",
    role: ["ROLE_ADMIN"],
  },
  {
    title: "Guruhlar",
    path: "/dashboard/admin/groups",
    src: "/icons/users.png",
    role: ["ROLE_ADMIN"],
  },
  {
    title: "O`quvchilar",
    path: "/dashboard/admin/students",
    src: "/icons/student.png",
    role: ["ROLE_ADMIN"],
  },
  {
    title: "Guruhga o'tkazish",
    path: "/dashboard/admin/transfer",
    src: "/icons/transfer.png",
    role: ["ROLE_ADMIN"],
  },
  {
    title: "Darslar tarixi",
    path: "/dashboard/admin/history-lesson",
    src: "/icons/lesson.png",
    role: ["ROLE_ADMIN"],
  },
  {
    title: "Ballar tarixi",
    path: "/dashboard/admin/history-bal",
    src: "/icons/ball-history.png",
    role: ["ROLE_ADMIN"],
  },
  {
    title: "Media fayllar",
    path: "/dashboard/admin/files",
    src: "/icons/video-players.png",
    role: ["ROLE_ADMIN"],
  },

  //teacher role
  {
    title: "Statistika",
    path: "/dashboard/teacher/statistika",
    src: "/icons/trend.png",
    role: ["ROLE_TEACHER"],
  },
  {
    title: "Guruhlar",
    path: "/dashboard/teacher/groups",
    src: "/icons/lesson.png",
    role: ["ROLE_TEACHER"],
  },
  {
    title: "Darslar",
    path: "/dashboard/teacher/lessons",
    src: "/icons/lesson.png",
    role: ["ROLE_TEACHER"],
  },
  {
    title: "Imtihonlar",
    path: "/dashboard/teacher/exams",
    src: "/icons/test.png",
    role: ["ROLE_TEACHER"],
  },
  {
    title: "Media fayllar",
    path: "/dashboard/teacher/files",
    src: "/icons/test.png",
    role: ["ROLE_TEACHER"],
  },
  {
    title: "KPI natijalar",
    path: "/dashboard/teacher/kpi-teacher",
    src: "/icons/kpi.png",
    role: ["ROLE_TEACHER"],
  },
  //director role
  {
    title: "Statistika",
    path: "/dashboard/director/reytingDirector",
    src: "/icons/trend.png",
    role: ["ROLE_DIRECTOR"],
  },
  {
    title: "Reyting",
    path: "/dashboard/director/reyting",
    src: "/icons/reyting.png",
    role: ["ROLE_DIRECTOR"],
  },
  {
    title: "Xodimlar",
    path: "/dashboard/director/teachers",
    src: "/icons/teacher.png",
    role: ["ROLE_DIRECTOR"],
  },
  {
    title: "Kurslar",
    path: "/dashboard/director/courses",
    src: "/icons/lesson.png",
    role: ["ROLE_DIRECTOR"],
  },
  {
    title: "Darslar tarixi",
    path: "/dashboard/director/lessons",
    src: "/icons/lesson.png",
    role: ["ROLE_DIRECTOR"],
  },
  {
    title: "Haftalik imtihon tarixi",
    path: "/dashboard/director/exam-history",
    src: "/icons/lesson.png",
    role: ["ROLE_DIRECTOR"],
  },
  {
    title: "Shop",
    path: "/dashboard/director/products",
    src: "/icons/shopping.png",
    role: ["ROLE_DIRECTOR"],
    badge: true,
  },
  {
    title: "Ball berish",
    path: "/dashboard/director/addBall",
    src: "/icons/give.png",
    role: ["ROLE_DIRECTOR"],
  },
  {
    title: "Ballar tarixi",
    path: "/dashboard/director/history-bal",
    src: "/icons/ball-history.png",
    role: ["ROLE_DIRECTOR"],
  },
  {
    title: "Media fayllar",
    path: "/dashboard/director/files",
    src: "/icons/video-players.png",
    role: ["ROLE_DIRECTOR"],
  },
  {
    title: "KPI natijalar",
    path: "/dashboard/director/kpi-teacher",
    src: "/icons/kpi.png",
    role: ["ROLE_DIRECTOR"],
  },
  
  //seo role
  // {
  //   title: "Statistika",
  //   path: "/dashboard/ceo/seoStatistika",
  //   src: "/icons/trend.png",
  //   role: ["ROLE_SEO"],
  // },
  {
    title: "Dinamik Statistika",
    path: "/dashboard/ceo/dynamic",
    src: "/icons/trend.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "Reyting",
    path: "/dashboard/ceo/reyting",
    src: "/icons/reyting.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "Xodimlar",
    path: "/dashboard/ceo/directors",
    src: "/icons/director.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "Darslar tarixi",
    path: "/dashboard/ceo/lessons",
    src: "/icons/lesson.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "Imtihonlar tarixi",
    path: "/dashboard/ceo/exam-history",
    src: "/icons/lesson.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "Shop",
    path: "/dashboard/ceo/product",
    src: "/icons/shopping.png",
    role: ["ROLE_SEO"],
    badge: true,
  },
  {
    title: "Ball berish",
    path: "/dashboard/ceo/addBall",
    src: "/icons/give.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "Ballar tarixi",
    path: "/dashboard/ceo/history-bal",
    src: "/icons/ball-history.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "Permit history",
    path: "/dashboard/ceo/permit-history",
    src: "/icons/quality.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "Xabarlar",
    path: "/dashboard/ceo/notification",
    src: "/icons/messages.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "Media fayllar",
    path: "/dashboard/ceo/add-video",
    src: "/icons/video-players.png",
    role: ["ROLE_SEO"],
  },
  {
    title: "KPI natijalar",
    path: "/dashboard/ceo/kpi-teacher",
    src: "/icons/kpi.png",
    role: ["ROLE_SEO"],
  },


  //education role
  {
    title: "Dinamik Statistika",
    path: "/dashboard/education/dynamic",
    src: "/icons/trend.png",
    role: ["ROLE_EDUCATION_DEPARTMENT"],
  },
  {
    title: "Bosqich imtihon yaratish",
    path: "/dashboard/education/groups",
    src: "/icons/lesson.png",
    role: ["ROLE_EDUCATION_DEPARTMENT"],
  },
  {
    title: "Bosqich imtihon jadvali",
    path: "/dashboard/education/exams",
    src: "/icons/test.png",
    role: ["ROLE_EDUCATION_DEPARTMENT"],
  },
  {
    title: "Xodim qo'shish",
    path: "/dashboard/education/create-employee",
    src: "/icons/users.png",
    role: ["ROLE_EDUCATION_DEPARTMENT"],
  },
  {
    title: "Haftalik imtihon yaratish",
    path: "/dashboard/education/management-exam",
    src: "/icons/director.png",
    role: ["ROLE_EDUCATION_DEPARTMENT"],
  },
  {
    title: "Haftalik imtihon tarixi",
    path: "/dashboard/education/exam-history",
    src: "/icons/lesson.png",
    role: ["ROLE_EDUCATION_DEPARTMENT"],
  },
  {
    title: "Darslar tarixi",
    path: "/dashboard/education/lessons",
    src: "/icons/lesson.png",
    role: ["ROLE_EDUCATION_DEPARTMENT"],
  },
  {
    title: "Media fayllar",
    path: "/dashboard/education/files",
    src: "/icons/video-players.png",
    role: ["ROLE_EDUCATION_DEPARTMENT"],
  },
  {
    title: "KPI natijalar",
    path: "/dashboard/education/kpi-teacher",
    src: "/icons/kpi.png",
    role: ["ROLE_EDUCATION_DEPARTMENT"],
  },
  //student role
  {
    title: "Reyting",
    path: "/dashboard/reyting",
    src: "/icons/reyting.png",
    role: ["ROLE_STUDENT"],
  },
  {
    title: "Progres",
    path: "/dashboard/student/progres",
    src: "/icons/progres.png",
    role: ["ROLE_STUDENT"],
  },
  {
    title: "Shop",
    path: "/dashboard/shopping",
    src: "/icons/shopping.png",
    role: ["ROLE_STUDENT"],
  },
  {
    title: "Buyurtmalar",
    path: "/dashboard/orders",
    src: "/icons/gift.png",
    role: ["ROLE_STUDENT"],
  },
  {
    title: "Ball almashtirish",
    path: "/dashboard/transaction",
    src: "/icons/transaction.png",
    role: ["ROLE_STUDENT"],
  },
  {
    title: "Ballar tarixi",
    path: "/dashboard/student/history-bal",
    src: "/icons/ball-history.png",
    role: ["ROLE_STUDENT"],
  },
  {
    title: "Eslatma",
    path: "/dashboard/student/exclamation",
    src: "/icons/exclamation.png",
    role: ["ROLE_STUDENT"],
  },
  {
    title: "Media fayllar",
    path: "/dashboard/student/files",
    src: "/icons/video-players.png",
    role: ["ROLE_STUDENT"],
  },

  //addition

  {
    title: "Dars yaratish",
    path: "/dashboard/addition",
    src: "/icons/lesson.png",
    role: ["ROLE_ADDITION_LESSON"],
  },
  {
    title: "Dars haqida",
    path: "/dashboard/additionLessons",
    src: "/icons/lesson.png",
    role: ["ROLE_ADDITION_LESSON"],
  },
  {
    title: "Media fayllar",
    path: "/dashboard/admin/files",
    src: "/icons/video-players.png",
    role: ["ROLE_ADDITION_LESSON"],
  },

  //sunday
  {
    title: "Sunday event yaratish",
    path: "/dashboard/sunday",
    src: "/icons/lesson.png",
    role: ["ROLE_SUNDAY_EVENT"],
  },
  {
    title: "Dars haqida",
    path: "/dashboard/sundayLessons",
    src: "/icons/lesson.png",
    role: ["ROLE_SUNDAY_EVENT"],
  },
  {
    title: "Media fayllar",
    path: "/dashboard/admin/files",
    src: "/icons/video-players.png",
    role: ["ROLE_SUNDAY_EVENT"],
  },


  {
    title: "TOP 10 STATISTIKA",
    path: "/dashboard/tv",
    src: "/icons/lesson.png",
    role: ["ROLE_TV"],
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    UserProvider.getOrderCount()
      .then((res) => {
        setOrderCount(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <SidebarWrapper>
      <div className="sidebar-menu">
        {NavListMenu.map(({ title, src, path, badge }, idx) =>
          badge ? (
            <Badge key={idx} count={orderCount}>
              <MyLink
                className={router.pathname === path ? "activelink" : "link"}
                to={path}
              >
                <img src={src} alt={title} />
                <span>{title}</span>
              </MyLink>
            </Badge>
          ) : (
            <MyLink
              className={router.pathname === path ? "activelink" : "link"}
              to={path}
              key={idx}
            >
              <img src={src} alt={title} />
              <span>{title}</span>
            </MyLink>
          )
        )}
      </div>
    </SidebarWrapper>
  );
};

export default Sidebar;
