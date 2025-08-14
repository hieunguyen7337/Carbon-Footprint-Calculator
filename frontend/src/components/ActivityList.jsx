import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ActivityList = ({ activities, setActivities, setEditingActivity }) => {
  const { user } = useAuth();

  const handleDelete = async (activityId) => {
    try {
      await axiosInstance.delete(`/api/activities/${activityId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setActivities(activities.filter((activity) => activity._id !== activityId));
    } catch (error) {
      alert('Failed to delete activity.');
    }
  };

  return (
    <div>
      {activities.map((activity) => (
        <div key={activity._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{activity.title}</h2>
          <p>{activity.description}</p>
          <p className="text-sm text-gray-500">Date: {new Date(activity.date).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingActivity(activity)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(activity._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
