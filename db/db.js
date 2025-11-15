const { mongoose } = require('mongoose');

const connectDB = async () => {
  try {
    const env = process.env.NODE_ENV || 'development';
    let dbURI;

    switch (env) {
      case 'production':
        dbURI = process.env.MONGO_URI_PROD;
        break;
      case 'test':
        dbURI = process.env.MONGO_URI_TEST;
        break;
      default:
        dbURI = process.env.MONGO_URI_DEV;
    }

    if (!dbURI) {
      throw new Error(`MONGO_URI is not defined for environment: ${env}`);
    }

    const conn = await mongoose.connect(dbURI);
    console.log(`MongoDB connected to ${env} database at ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // process.exit(1);
    throw error; // Instead of process.exit
  }
};

module.exports = connectDB;
