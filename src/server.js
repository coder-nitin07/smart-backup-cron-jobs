const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs-extra');
const db = require('./config/db');
const router = require('./routes/backupRoutes');
require('dotenv').config();

app.use(express.json());

// DB connection
db();

// backup folder exist
const BACKUPS_DIR = process.env.BACKUPS_DIR || path.join(__dirname, '..', 'backups');

// ensure backups dir exists
fs.ensureDirSync(BACKUPS_DIR);

// route
app.use('/api/backups', router);

app.get('/', (req, res)=>{
    res.send('Smart Auto Backup App running...');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server started on PORT ${ PORT }`);
});