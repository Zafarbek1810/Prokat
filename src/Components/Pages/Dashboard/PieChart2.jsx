import { useEffect, useState } from "react";
import AdminProvider from "../../../Data/AdminProvider";

const PieChart2 = () => {
  const [forRender, setForRender] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    AdminProvider.statistics().then((res) => {
      setData(res.data);
      setForRender(Math.random());
    });
  }, []);

  useEffect(() => {
    const initChart = async () => {
      const echartElemPie = document.getElementById("echartPie2");

      if (echartElemPie) {
        // Dynamically import echarts only on client side
        const echarts = await import("echarts");
        const echartPie = echarts.init(echartElemPie);

        const options = {
          color: [
            "#ff6b6b", // Chiroyli qizil
            "#4ecdc4", // Turkuaz
            "#45b7d1", // Ko'k
            "#96ceb4", // Yashil
            "#feca57", // Sariq
            "#ff9ff3", // Pushti
            "#54a0ff", // Yengil ko'k
            "#5f27cd", // Binafsha
          ],
          tooltip: {
            show: true,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderColor: "#e1e5e9",
            borderWidth: 1,
            textStyle: {
              color: "#333",
              fontSize: 14,
              fontWeight: 500,
            },
            formatter: function (params) {
              return `<div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
                <div style="color: #666;">Soni: ${params.value}</div>
                <div style="color: #999; font-size: 12px;">Foiz: ${params.percent}%</div>
              </div>`;
            },
          },
          series: [
            {
              name: "Продажи по брендам",
              type: "pie",
              radius: "60%",
              center: ["50%", "50%"],
              data: data?.popular_categories?.map((i, index) => {
                return {
                  value: i.listing_count,
                  name: i.name,
                };
              }),
              itemStyle: {
                borderRadius: 10,
                borderWidth: 3,
                borderColor: "#fff",
                emphasis: {
                  shadowBlur: 25,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.2)",
                  scale: 1.08,
                },
              },
            },
          ],
        };

        echartPie.setOption(options);

        const handleResize = () => {
          setTimeout(() => {
            echartPie.resize();
          }, 500);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup function
        return () => {
          window.removeEventListener("resize", handleResize);
          echartPie.dispose();
        };
      }
    };

    initChart();
  }, [forRender]);

  return <div id="echartPie2" style={{ width: "100%", height: "400px" }} />;
};

export default PieChart2;
