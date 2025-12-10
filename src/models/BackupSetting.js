const mongoose = require('mongoose');

const BackupSettingSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        index: true
    },
    frequency: {
        type: String,
        enum: [ 'hourly', 'daily', 'weekly', 'custom' ],
        default: 'daily'
    },
    cronExpression: {
        type: String,
        default: null
    },
    pathToBreak: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BackupSettings', BackupSettingSchema);