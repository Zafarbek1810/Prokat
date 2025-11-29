import { useEffect, useState } from "react";
import CategoryProvider from "../../../Data/CategoryProvider";

const BasicAreaChart = () => {
    const [forRender, setForRender] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    CategoryProvider.getAllCategory()
      .then((categoriesRes) => {
        const categoriesData = categoriesRes?.data;
        if (Array.isArray(categoriesData?.results)) {
          setCategories(categoriesData.results);
        } else if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          setCategories([]);
        }
        setForRender(Math.random());
      })
      .catch((err) => {
        console.log(err);
        setCategories([]);
      });
  }, []);

  const resolveListingCount = (category) =>
    category?.listing_count ??
    category?.active_count ??
    category?.ads_count ??
    category?.count ??
    0;

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
  
  useEffect(() => {
    if (!categories || categories.length === 0) {
      return;
    }

    const initChart = async () => {
      const basicAreaElem = document.getElementById("basicArea");

      if (basicAreaElem) {
        // Dynamically import echarts only on client side
        const echarts = await import("echarts");
        const basicArea = echarts.init(basicAreaElem);

        // Calculate max value from listing counts
        const listingCounts = categories.map((category) =>
          resolveListingCount(category)
        );
        const maxListingCount = listingCounts.length > 0 ? Math.max(...listingCounts) : 0;
        // Round up to nearest 10 and add 20% padding, minimum 10
        const calculatedMax = maxListingCount > 0 
          ? Math.ceil(maxListingCount * 1.2 / 10) * 10 
          : 10;
        const yAxisMax = Math.max(calculatedMax, 10);
        
        // Calculate dynamic left padding based on max value digits
        const maxValueDigits = yAxisMax.toString().length;
        const leftPadding = maxValueDigits > 3 ? "12%" : maxValueDigits > 2 ? "8%" : "4%";

        const options = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              animation: true,
            },
          },
          grid: {
            left: leftPadding,
            top: "4%",
            right: "3%",
            bottom: "10%",
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: categories.map((category, idx) =>
              resolveCategoryName(category, idx)
            ),
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
            max: yAxisMax,
            interval:10,
            axisLabel: {
              formatter: "{value}",
              color: "#666",
              fontSize: 12,
              fontStyle: "normal",
              fontWeight: 400,
              width: maxValueDigits > 3 ? 50 : maxValueDigits > 2 ? 40 : 30,
              overflow: "truncate",
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
              data: listingCounts,
              symbolSize: 8,
              showSymbol: false,
              lineStyle: {
                color: "rgb(59,130,246)",
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
                        color: "rgba(59,130,246, 1)",
                      },
                      {
                        offset: 0.3,
                        color: "rgba(59,130,246, 0.7)",
                      },
                      {
                        offset: 1,
                        color: "rgba(59,130,246, 0.3)",
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
  }, [forRender, categories]);

  return <div id="basicArea" style={{ width: "100%", height: "400px" }} />;
};

export default BasicAreaChart;
