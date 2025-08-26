// Worker list component
import React from 'react';
import { Card } from '../../shared/components/Card';
import { Table, StatusBadge } from '../../shared/components/Table';
import { Button } from '../../shared/components/Form';
import { formatCurrency } from '../../shared/utils/formatters';

const WorkerList = ({ workers, onAddWorker, onViewDetails }) => {
  const columns = [
    {
      header: 'Name',
      key: 'name'
    },
    {
      header: 'Role',
      key: 'role'
    },
    {
      header: 'Pay Type',
      key: 'payType'
    },
    {
      header: 'Pay Rate',
      key: 'payRate',
      render: (value) => formatCurrency(value)
    },
    {
      header: 'Loan Balance',
      key: 'loans',
      render: (value) => formatCurrency(value)
    },
    {
      header: 'Status',
      key: 'active',
      render: (value) => (
        <StatusBadge
          status={value ? 'Active' : 'Inactive'}
          variant={value ? 'success' : 'danger'}
        />
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, worker) => (
        <button
          onClick={() => onViewDetails(worker.id)}
          className="text-blue-500 hover:underline"
        >
          View Details
        </button>
      )
    }
  ];

  const actions = (
    <Button
      onClick={onAddWorker}
      icon="➕"
      size="small"
    >
      Add New Worker
    </Button>
  );

  return (
    <Card title="Worker List" actions={actions}>
      <Table
        columns={columns}
        data={workers}
        emptyMessage="No workers found"
      />
    </Card>
  );
};

export default WorkerList;
