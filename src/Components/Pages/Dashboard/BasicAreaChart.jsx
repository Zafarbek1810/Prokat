import { useEffect, useState } from "react";
import AdminProvider from "../../../Data/AdminProvider";

const BasicAreaChart = () => {
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
      const basicAreaElem = document.getElementById("basicArea");

      if (basicAreaElem) {
        // Dynamically import echarts only on client side
        const echarts = await import("echarts");
        const basicArea = echarts.init(basicAreaElem);

        const options = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              animation: true,
            },
          },
          grid: {
            left: "4%",
            top: "4%",
            right: "3%",
            bottom: "10%",
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: data?.popular_categories?.map((v, i) => {
              return v.name;
            }),
            axisLabel: {
              formatter: "{value}",
              color: "#666",
              fontSize: 12,
              fontStyle: "normal",
              fontWeight: 400,
            },
            axisLine: {
              lineStyle: {
                color: "#ccc",
                width: 1,
              },
            },
            axisTick: {
              lineStyle: {
                color: "#ccc",
                width: 1,
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#ccc",
                width: 1,
              },
            },
          },
          yAxis: {
            type: "value",
            min: 0,
            max: 50,
            interval: 5,
            axisLabel: {
              formatter: "{value}",
              color: "#666",
              fontSize: 12,
              fontStyle: "normal",
              fontWeight: 400,
            },
            axisLine: {
              lineStyle: {
                color: "#ccc",
                width: 1,
              },
            },
            axisTick: {
              lineStyle: {
                color: "#ccc",
                width: 1,
              },
            },
            splitLine: {
              lineStyle: {
                color: "#ddd",
                width: 1,
                opacity: 0.5,
              },
            },
          },
          series: [
            {
              name: "Visit",
              type: "line",
              smooth: true,
              data: data?.popular_categories?.map((v, i) => {
                  return v.listing_count;
                }),
              symbolSize: 8,
              showSymbol: false,
              lineStyle: {
                color: "rgb(255, 87, 33)",
                opacity: 1,
                width: 1.5,
              },
              itemStyle: {
                show: false,
                color: "#ff5721",
                borderColor: "#ff5721",
                borderWidth: 1.5,
              },
              areaStyle: {
                normal: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(255, 87, 33, 1)",
                      },
                      {
                        offset: 0.3,
                        color: "rgba(255, 87, 33, 0.7)",
                      },
                      {
                        offset: 1,
                        color: "rgba(255, 87, 33, 0)",
                      },
                    ],
                  },
                },
              },
            },
          ],
        };

        basicArea.setOption(options);

        const handleResize = () => {
          setTimeout(() => {
            basicArea.resize();
          }, 500);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup function
        return () => {
          window.removeEventListener("resize", handleResize);
          basicArea.dispose();
        };
      }
    };

    initChart();
  }, [forRender]);

  return <div id="basicArea" style={{ width: "100%", height: "400px" }} />;
};

export default BasicAreaChart;
