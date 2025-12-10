const mongoose = require('mongoose');

const BackupLogSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: [ 'success', 'failed' ],
        required: true
    },
    backupFilePath: {
        type: String,
        required: true
    },
    errorMessage: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

BackupLogSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 60 * 60 * 24 * 7 // 7 days by default
    }
);

module.exports = mongoose.model('BackupLog', BackupLogSchema);