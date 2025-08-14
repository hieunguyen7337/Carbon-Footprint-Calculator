const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  date: { type: Date },
});

module.exports = mongoose.model('Activity', activitySchema);