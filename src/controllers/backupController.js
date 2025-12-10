const path = require('path');
const fs = require('fs');
const BackupLog = require('../models/BackupLog');

const downloadBackup = async (req, res) => {
    try {
        const { id } = req.params;

        const backup = await BackupLog.findById(id);
        if (!backup) {
            return res.status(404).json({ message: "Backup not found" });
        }

        // FIX: use correct field name
        const filePath = path.resolve(backup.backupFilePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Backup file missing on server" });
        }

        res.download(filePath, path.basename(filePath));
    } catch (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Download failed", error: err.message });
    }
};

const restoreBackup = async (req, res) => {
    try {
        const { id } = req.params;

        const backup = await BackupLog.findById(id);
        if (!backup) {
            return res.status(404).json({ message: "Backup not found" });
        }

        const filePath = path.resolve(backup.backupFilePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Backup file missing" });
        }

        const targetFolder = process.env.DATA_FOLDER || './data';
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }

        const restorePath = path.join(targetFolder, path.basename(filePath));

        fs.copyFileSync(filePath, restorePath);

        return res.json({
            message: "Backup restored successfully",
            restoredTo: restorePath
        });

    } catch (err) {
        console.error("Restore error:", err);
        res.status(500).json({ message: "Restore failed", error: err.message });
    }
};

module.exports = { downloadBackup, restoreBackup };