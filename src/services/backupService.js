const path = require("path");
const fs = require("fs-extra");
const { createZip } = require("../utils/zipHelper");
const BackupLog = require("../models/BackupLog");
const BackupSetting = require("../models/BackupSetting");

const runBackupForUser = async (userId) => {
  try {
    // fetch active backup settings
    const settings = await BackupSetting.findOne({ userId, isActive: true });
    if (!settings || !settings.pathToBackup || settings.pathToBackup.trim() === "") {
      return { success: false, message: "No valid backup path found for user " + userId };
    }

    // output folder
    const BACKUPS_DIR = path.join(process.cwd(), "backups");

    // create ZIP
    const zipPath = await createZip(
      settings.pathToBackup,
      BACKUPS_DIR,
      { prefix: `backup_${userId}` }
    );

    // save log
    await BackupLog.create({
      userId,
      status: "success",
      backupFilePath: zipPath,
      errorMessage: null,
    });

    return { success: true, message: "Backup created successfully", file: zipPath };
  } catch (err) {
    console.error("Backup error:", err);

    // log failure
    await BackupLog.create({
      userId,
      status: "failed",
      backupFilePath: null,
      errorMessage: err.message,
    });

    return { success: false, message: "Backup failed", error: err.message };
  }
};

module.exports = { runBackupForUser };
