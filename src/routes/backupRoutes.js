const express = require('express');
const { restoreBackup, downloadBackup } = require('../controllers/backupController');
const router = express.Router();

router.post('/:id/restore', restoreBackup);
router.get('/:id/download', downloadBackup);

module.exports = router;