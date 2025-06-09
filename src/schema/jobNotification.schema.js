const mongoose = require('mongoose');

const JobNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
}); 

module.exports = mongoose.model('JobNotification', JobNotificationSchema);
