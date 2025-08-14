import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

// Define the available choices for activity types and units
const activityTypes = [
  'Travel',
  'Electricity',
  'Gas',
  'Water',
  'Waste',
  'Diet',
  'Other',
];

const units = {
  Travel: ['km', 'miles', 'liters of fuel'],
  Electricity: ['kWh'],
  Gas: ['kWh', 'm³'],
  Water: ['liters', 'm³'],
  Waste: ['kg'],
  Diet: ['kg of meat'],
  Other: ['unit'],
};

const ActivityForm = ({ activities, setActivities, editingActivity, setEditingActivity }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    activityType: '',
    quantity: '',
    unit: '',
    deadline: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingActivity) {
      setFormData({
        activityType: editingActivity.activityType,
        quantity: editingActivity.quantity,
        unit: editingActivity.unit,
        deadline: editingActivity.deadline ? editingActivity.deadline.split('T')[0] : '',
      });
    } else {
      setFormData({ activityType: '', quantity: '', unit: '', deadline: '' });
    }
  }, [editingActivity]);

  const validateForm = () => {
    let newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    // Activity Type validation
    if (!formData.activityType.trim()) {
      newErrors.activityType = 'Activity type is required.';
    }

    // Quantity validation
    if (formData.quantity === '' || isNaN(formData.quantity) || formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be a non-negative number.';
    }

    // Unit validation
    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required.';
    }

    // Deadline validation
    if (formData.deadline && formData.deadline < today) {
      newErrors.deadline = 'Deadline cannot be in the past.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Reset the unit when the activity type changes
    if (name === 'activityType') {
      setFormData((prevData) => ({
        ...prevData,
        unit: units[value] && units[value].length > 0 ? units[value][0] : '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please correct the errors in the form.');
      return;
    }

    try {
      if (editingActivity) {
        const response = await axiosInstance.put(`/api/activities/${editingActivity._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setActivities(activities.map((activity) => (activity._id === response.data._id ? response.data : activity)));
      } else {
        const response = await axiosInstance.post('/api/activities', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setActivities([...activities, response.data]);
      }
      setEditingActivity(null);
      setFormData({ activityType: '', quantity: '', unit: '', deadline: '' });
      alert('Activity saved successfully.');
    } catch (error) {
      alert('Failed to save activity.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingActivity ? 'Edit Activity' : 'Add New Activity'}
      </h1>

      {/* Activity Type Dropdown */}
      <select
        name="activityType"
        value={formData.activityType}
        onChange={handleChange}
        className={`w-full mb-2 p-2 border rounded ${errors.activityType ? 'border-red-500' : ''}`}
        required
      >
        <option value="" disabled>Select an Activity Type</option>
        {activityTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      {errors.activityType && <p className="text-red-500 text-sm mb-4">{errors.activityType}</p>}

      {/* Quantity */}
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        className={`w-full mb-2 p-2 border rounded ${errors.quantity ? 'border-red-500' : ''}`}
        min="0"
        step="any"
        required
      />
      {errors.quantity && <p className="text-red-500 text-sm mb-4">{errors.quantity}</p>}

      {/* Unit Dropdown (conditionally rendered) */}
      {formData.activityType && units[formData.activityType] && (
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className={`w-full mb-2 p-2 border rounded ${errors.unit ? 'border-red-500' : ''}`}
          required
        >
          <option value="" disabled>Select a Unit</option>
          {units[formData.activityType].map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      )}
      {errors.unit && <p className="text-red-500 text-sm mb-4">{errors.unit}</p>}

      {/* Date */}
      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        className={`w-full mb-2 p-2 border rounded ${errors.deadline ? 'border-red-500' : ''}`}
      />
      {errors.deadline && <p className="text-red-500 text-sm mb-4">{errors.deadline}</p>}

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4">
        {editingActivity ? 'Update Activity' : 'Add Activity'}
      </button>
    </form>
  );
};

export default ActivityForm;
