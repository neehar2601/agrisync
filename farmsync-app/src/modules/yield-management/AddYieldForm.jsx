// Add yield form component
import React, { useState } from 'react';
import { Card } from '../../shared/components/Card';
import { FormField, Button } from '../../shared/components/Form';
import { CROP_UNITS } from '../../shared/utils/constants';

const AddYieldForm = ({ onYieldAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: CROP_UNITS.KG
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
      await onYieldAdded(formData);
      setFormData({ name: '', quantity: '', unit: CROP_UNITS.KG });
    } catch (error) {
      console.error('Error adding yield:', error);
    } finally {
      setLoading(false);
    }
  };

  const unitOptions = Object.values(CROP_UNITS).map(unit => ({
    value: unit,
    label: unit
  }));

  return (
    <Card title="Add New Yield">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Crop Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Enter crop name"
        />
        
        <FormField
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          required
          placeholder="Enter quantity"
          min="0"
          step="0.01"
        />
        
        <FormField
          label="Unit"
          type="select"
          name="unit"
          value={formData.unit}
          onChange={handleInputChange}
          options={unitOptions}
          required
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          icon="➕"
        >
          Add Yield
        </Button>
      </form>
    </Card>
  );
};

export default AddYieldForm;
