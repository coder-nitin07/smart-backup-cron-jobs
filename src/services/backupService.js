const BackupSettings = require('../models/BackupSetting');
const BackupLog = require('../models/BackupLog');
const { createZip } = require('../utils/zipHelper');
const path = require('path');

class BackupService {

    static async runBackup(userId){
        try {
            // get backup setting fro the user
            const settings = await BackupSettings.findOne({ userId, isActive: true });

            if(!settings){
                return { success: false, message: 'No active backup settings found for this user.' };
            }

            
            // determine output folder
            const BACKUPS_DIR = process.env.BACKUPS_DIR || path.join(__dirname, '..', '..', 'backups');

            console.log("All keys in settings:", Object.keys(settings));
            console.log("Raw settings:", settings);

            const backupPath = settings.pathToBackup || settings.get?.('pathToBackup');

            if (!backupPath || backupPath.trim() === "") {
                throw new Error("No valid backup path found for user " + userId);
            }

            // use backupPath in createZip
            const zipPath = await createZip(
                backupPath,
                BACKUPS_DIR,
                { prefix: `backup_${ userId }` }
            );

            // store success log in DB
            await BackupLog.create({
                userId,
                status: 'success',
                backupFilePath: zipPath,
                errormessage: null
            });

            return {
                success: true,
                message: "Backup created successfully.",
                file: zipPath
            };
        } catch (err) {
            console.log('Backup error : ', err);

            // Save the failed log
            await BackupLog.create({
                userId,
                status: 'failed',
                backupFilePath: null,
                errorMessage: err.message
            });

            return {
                success: false,
                message: "Backup failed.",
                error: error.message
            };
        }
    }
}

module.exports = BackupService;