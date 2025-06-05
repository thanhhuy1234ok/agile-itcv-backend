const mongoose = require('mongoose');

const JobNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs',
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

JobNotificationSchema.index({ userId: 1, jobId: 1 }, { unique: true }); 

module.exports = mongoose.model('JobNotification', JobNotificationSchema);
