const mongoose = require('mongoose');

const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            dbName: "ChatApp",
            maxPoolSize: 50
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports = dbConnect;