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
  emailNotificationsEnabled: {
    type: Boolean,
    default: true, 
  },
}, {
  timestamps: true,
}); 

module.exports = mongoose.model('JobNotification', JobNotificationSchema);
