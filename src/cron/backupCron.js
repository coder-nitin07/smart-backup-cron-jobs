const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(process.cwd(), "backups");
const historyDir = path.join(process.cwd(), "backups/history");

// Cron job (runs every 1 minute)
const startBackupCron = () => {
  cron.schedule("* * * * *", () => {
    console.log("⏳ Cron Job Running: Checking for backups...");

    const files = fs.readdirSync(uploadsDir).filter(
      (file) => file !== "history"
    );

    if (files.length === 0) {
      console.log("No backup files found.");
      return;
    }

    files.forEach((file) => {
      const oldPath = path.join(uploadsDir, file);
      const newPath = path.join(historyDir, file);

      fs.renameSync(oldPath, newPath);
      console.log(`Moved backup to history: ${ file }`);
    });
  });
};

module.exports = { startBackupCron };
