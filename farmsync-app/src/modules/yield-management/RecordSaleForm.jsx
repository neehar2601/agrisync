// Record sale form component
import React, { useState } from 'react';
import { Card } from '../../shared/components/Card';
import { FormField, Button } from '../../shared/components/Form';

const RecordSaleForm = ({ yields, onSaleRecorded }) => {
  const [formData, setFormData] = useState({
    cropId: '',
    quantity: '',
    price: '',
    seller: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSaleRecorded(formData);
      setFormData({ cropId: '', quantity: '', price: '', seller: '' });
    } catch (error) {
      console.error('Error recording sale:', error);
    } finally {
      setLoading(false);
    }
  };

  const yieldOptions = yields.map(crop => ({
    value: crop.id,
    label: `${crop.cropName} (${crop.quantity} ${crop.unit})`
  }));

  return (
    <Card title="Record a Sale">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Select Crop"
          type="select"
          name="cropId"
          value={formData.cropId}
          onChange={handleInputChange}
          options={yieldOptions}
          required
        />
        
        <FormField
          label="Quantity Sold"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          required
          placeholder="Enter quantity sold"
          min="0"
          step="0.01"
        />
        
        <FormField
          label="Selling Price (₹)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
          placeholder="Enter selling price"
          min="0"
          step="0.01"
        />
        
        <FormField
          label="Seller Name"
          name="seller"
          value={formData.seller}
          onChange={handleInputChange}
          required
          placeholder="Enter seller name"
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          icon="📋"
        >
          Record Sale
        </Button>
      </form>
    </Card>
  );
};

export default RecordSaleForm;
