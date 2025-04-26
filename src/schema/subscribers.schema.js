const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    skill:[{
        type: String,
        required: true,
        trim: true,
    }],
});

module.exports = mongoose.model('Subscribers', SubscriberSchema);
