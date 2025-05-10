const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    skill: [
        {
            type: String,
            trim: true,
        }
    ],
    description: {
        type: String,
        required: true,
        trim: true,
    },
    companyId: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        name: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        }
    },
    salary: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

    deletedAt: {
        type: Date,
        default: null,
    },
    createdBy: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        email: {
            type: String,
            trim: true,
        }
    },
    updatedBy: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        email: {
            type: String,
            trim: true,
        }
    },
    deletedBy: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        email: {
            type: String,
            default: null,
            trim: true,
        }
    },
});

module.exports = mongoose.model('Jobs', JobSchema);
