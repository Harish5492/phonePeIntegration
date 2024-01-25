import mongoose, { ConnectOptions } from 'mongoose';

mongoose.Promise = Promise;

const connectDB = async (): Promise<void> => {
  try {
    const DB = 'mongodb://127.0.0.1:27017/user';
    const options: ConnectOptions = {
        autoIndex: true
      };
  
    await mongoose.connect(DB, options);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('Error:', err);
  }
};

export default connectDB;
