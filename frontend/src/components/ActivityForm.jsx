import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ActivityForm = ({ activities, setActivities, editingActivity, setEditingActivity }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ activityType: '', quantity: '', unit: '' });

  useEffect(() => {
    if (editingActivity) {
      setFormData({
        activityType: editingActivity.activityType,
        quantity: editingActivity.quantity,
        unit: editingActivity.unit,
      });
    } else {
      setFormData({ activityType: '', quantity: '', unit: '' });
    }
  }, [editingActivity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setFormData({ activityType: '', quantity: '', unit: '' });
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

      {/* Activity Type */}
      <input
        type="text"
        placeholder="Activity Type (e.g., Travel, Electricity)"
        value={formData.activityType}
        onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      {/* Quantity */}
      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        min="0"
        step="any"
        required
      />

      {/* Unit */}
      <input
        type="text"
        placeholder="Unit (e.g., km, kWh, liters)"
        value={formData.unit}
        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingActivity ? 'Update Activity' : 'Add Activity'}
      </button>
    </form>
  );
};

export default ActivityForm;
