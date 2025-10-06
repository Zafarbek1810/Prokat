import { memo } from "react";
import { Empty, Table as AntdTable } from "antd";
import Pagination from "../Pagination/Pagination";
import { TableStyleWrapper } from "./style";

const Table = ({
  columns = [], data = [], pagination = false, pointerly = true, setPage,...props
}) => {
  return (
    <TableStyleWrapper>
    <div className={`table__wrapper${pointerly && " table_pointerly"}`}>
      <div className="table__responsive">
        <AntdTable columns={columns} locale={{emptyText: <Empty description="Ma'lumot topilmadi" />}} dataSource={data} pagination={false} {...props} />
      </div>
      {pagination && (
        <div className="pt20 px20 pb10">
          <Pagination { ...pagination} setPage={setPage} />
        </div>
      )}
    </div>
    </TableStyleWrapper>
  )
}

export default memo(Table);
