import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import { useAuth } from '../context/AuthContext';

const Activity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get('/api/activities', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setActivities(response.data);
      } catch (error) {
        alert('Failed to fetch activities.');
      }
    };

    fetchActivities();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <ActivityForm
        activities={activities}
        setActivities={setActivities}
        editingActivity={editingActivity}
        setEditingActivity={setEditingActivity}
      />
      <ActivityList activities={activities} setActivities={setActivities} setEditingActivity={setEditingActivity} />
    </div>
  );
};

export default Activity;
