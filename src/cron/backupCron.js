const cron = require("node-cron");
const BackupSetting = require("../models/BackupSetting");
const { runBackupForUser } = require("../services/backupService");

const startBackupCron = () => {
  // runs every 1 minute
  cron.schedule("* * * * *", async () => {
    console.log("Cron Running: Checking user backup schedules...");

    // fetch all active backup users
    const users = await BackupSetting.find({ isActive: true });

    if (users.length === 0) {
      console.log("No active backup settings found.");
      return;
    }

    for (let user of users) {
      const result = await runBackupForUser(user.userId);
      console.log(result.message);
    }
  });
};

module.exports = { startBackupCron };