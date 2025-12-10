const mongoose = require('mongoose');

const db =  async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('mongoDB connected successfully');
    } catch (err) {
        console.log('Error while connected with the database ', err);
        process.exit(1);
    }
};

module.exports = db;