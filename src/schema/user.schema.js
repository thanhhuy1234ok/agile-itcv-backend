const mongoose = require('mongoose');
const ROLES = require('../constants/role')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Roles',
            required: true,
        },
        name: {
            type: String,
        }
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
    },
    refresh_Token: {
        type: String,
        default: null,
    },
    dateOfBirth: {
        type: String,
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

module.exports = mongoose.model('User', UserSchema);
