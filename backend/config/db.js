// config/db.js

const mongoose = require("mongoose");
const colors = require("colors");

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,      // Use the new URL parser to avoid deprecation warnings
      useUnifiedTopology: true,   // Use the new topology engine to avoid deprecation warnings
    });

    // Log a success message with the host name of the connected database
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    // If an error occurs, log the error message in red and bold
    console.error(`Error: ${error.message}`.red.bold);
    // Exit with a non-zero status code to indicate an error
    process.exit(1);
  }
};

// Export the connectDB function
module.exports = connectDB;