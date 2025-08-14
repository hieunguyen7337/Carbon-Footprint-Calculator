const Activity = require('../models/Activity');

// @desc    Get user activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new activity
// @route   POST /api/activities
// @access  Private
const addActivity = async (req, res) => {
  const { activityType, quantity, unit, date } = req.body;
  try {
    const activity = await Activity.create({ userId: req.user.id, activityType, quantity, unit, date });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res) => {
  const { activityType, quantity, unit, date } = req.body;
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    // Ensure only the owner can update their activity
    if (activity.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    activity.activityType = activityType || activity.activityType;
    activity.quantity = quantity ?? activity.quantity; // Use ?? for null/undefined check
    activity.unit = unit || activity.unit;
    activity.date = date || activity.date;

    const updatedActivity = await activity.save();
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    // Ensure only the owner can delete their activity
    if (activity.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Using deleteOne for newer Mongoose versions
    await activity.deleteOne();
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getActivities, addActivity, updateActivity, deleteActivity };