const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    status:{
        type: String,

    },
    companyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Companies',
        required: true,
    },
    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
        required: true,
    },
    history:[{
        status:{
            type: String,
            required: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        updatedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Resume', ResumeSchema);
