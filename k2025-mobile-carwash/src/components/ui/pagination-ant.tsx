import React from 'react';
import { Pagination } from 'antd';

interface PaginationAntProps {
  current?: number;
  total?: number;
  pageSize?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  disabled?: boolean;
  simple?: boolean;
  responsive?: boolean;
}

const PaginationAnt: React.FC<PaginationAntProps> = ({
  current = 1,
  total = 50,
  pageSize = 10,
  showSizeChanger = true,
  showQuickJumper = false,
  showTotal = true,
  onChange,
  onShowSizeChange,
  disabled = false,
  simple = false,
  responsive = true
}) => {
  return (
    <div className="flex justify-center mt-6">
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        showSizeChanger={showSizeChanger}
        showQuickJumper={showQuickJumper}
        showTotal={showTotal ? (total, range) => `${range[0]}-${range[1]} of ${total} items` : undefined}
        onChange={onChange}
        onShowSizeChange={onShowSizeChange}
        disabled={disabled}
        simple={simple}
        responsive={responsive}
        className="custom-pagination"
      />
    </div>
  );
};

export default PaginationAnt;