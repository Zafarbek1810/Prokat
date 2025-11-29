import { useEffect, useState } from "react";
import AdminProvider from "../../../Data/AdminProvider";

const PieChart = () => {
  const [forRender, setForRender] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    AdminProvider.statistics().then((res) => {
      setData(res.data);
      setForRender(Math.random());
    });
  }, []);

  useEffect(() => {
    // Don't render chart if data is not loaded yet
    if (!data || !data.listings) {
      return;
    }

    let echartPie = null;
    let handleResize = null;

    const initChart = async () => {
      const echartElemPie = document.getElementById("echartPie");

      if (echartElemPie) {
        // Dynamically import echarts only on client side
        const echarts = await import("echarts");
        echartPie = echarts.init(echartElemPie);

        const options = {
          color: [
            "#667eea", // Zamonaviy ko'k gradient
            "#764ba2", // Chiroyli binafsha
            "#f093fb", // Pushti gradient
            "#f5576c", // Qizg'ish pushti
            "#4facfe", // Yengil ko'k
            "#00f2fe", // Turkuaz
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
                <div style="color: #666;">Qiymat: ${params.value}</div>
                <div style="color: #999; font-size: 12px;">Foiz: ${params.percent}%</div>
              </div>`;
            },
          },
          series: [
            {
              name: "Продажа по категориям",
              type: "pie",
              radius: "60%",
              center: ["50%", "50%"],
              data: [
                {
                  value: data.listings?.total || 0,
                  name: "Общий",
                },
                {
                  value: data.listings?.new || 0,
                  name: "Новый",
                },
                {
                  value: data.listings?.active || 0,
                  name: "Актив",
                },
                {
                  value: data.listings?.pending || 0,
                  name: "Ожидающий",
                },
              ],
              itemStyle: {
                borderRadius: 8,
                borderWidth: 2,
                borderColor: "#fff",
                emphasis: {
                  shadowBlur: 20,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.3)",
                  scale: 1.05,
                },
              },
            },
          ],
        };

        echartPie.setOption(options);

        handleResize = () => {
          setTimeout(() => {
            if (echartPie) {
              echartPie.resize();
            }
          }, 500);
        };

        window.addEventListener("resize", handleResize);
      }
    };

    initChart();

    // Cleanup function
    return () => {
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (echartPie) {
        echartPie.dispose();
        echartPie = null;
      }
    };
  }, [forRender, data]);

  return <div id="echartPie" style={{ width: "100%", height: "400px" }} />;
};

export default PieChart;
