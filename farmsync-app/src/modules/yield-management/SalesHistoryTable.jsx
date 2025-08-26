// Sales history table component
import React from 'react';
import { Card } from '../../shared/components/Card';
import { Table } from '../../shared/components/Table';
import { formatCurrency, formatDate } from '../../shared/utils/formatters';

const SalesHistoryTable = ({ sales }) => {
  const columns = [
    {
      header: 'Date',
      key: 'date',
      render: (value) => formatDate(value)
    },
    {
      header: 'Crop Name',
      key: 'cropName'
    },
    {
      header: 'Quantity Sold',
      key: 'quantity',
      render: (value) => `${value} kg`
    },
    {
      header: 'Price',
      key: 'price',
      render: (value) => formatCurrency(value)
    },
    {
      header: 'Seller',
      key: 'seller'
    }
  ];

  return (
    <Card title="Yields & Sales History">
      <Table
        columns={columns}
        data={sales}
        emptyMessage="No sales recorded yet"
      />
    </Card>
  );
};

export default SalesHistoryTable;
