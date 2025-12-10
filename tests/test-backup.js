const BackupService = require('../src/services/backupService');
require('dotenv').config();
require('../src/config/db')();

(async () => {
    const result = await BackupService.runBackup("user123");
    console.log(result);
    process.exit(0);
})();