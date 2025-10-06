import { memo } from "react";
import { Pagination as AntdPagination } from "antd";

const Pagination = ({
  current = 1,
  total = 0,
  pageSize = 20,
  setPage,
  pageChange = (p, s) => {
    setPage(p)
  },
}) => {
  return (
    <>
      <AntdPagination
        current={current}
        total={total}
        pageSize={pageSize}
        showSizeChanger={false}
        onChange={pageChange}
      />
    </>
  );
};

export default memo(Pagination);
