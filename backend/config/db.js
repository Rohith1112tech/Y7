import 'dotenv/config';
import mongoose from 'mongoose';


const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    console.error('\n❌ MONGODB_URI is missing from backend/.env');
    console.error('👉 Please configure backend/.env with your MongoDB Atlas connection string.');
    console.error('   Example: MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/studioy7?retryWrites=true&w=majority\n');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
