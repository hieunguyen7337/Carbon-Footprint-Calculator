const express = require('express');
const { getActivities, addActivity, updateActivity, deleteActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes for getting all activities and adding a new one
router.route('/').get(protect, getActivities).post(protect, addActivity);

// Routes for updating and deleting a specific activity by ID
router.route('/:id').put(protect, updateActivity).delete(protect, deleteActivity);

module.exports = router;
