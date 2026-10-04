import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ink_carvers';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Standard MongoDB connection failed (${error.message}). Initializing In-Memory MongoDB Server for uninterrupted high-performance operation...`);
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'ink_carvers'
        }
      });
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] In-Memory MongoDB Server active at: ${memUri}`);
      return conn;
    } catch (memError) {
      console.error('[Database] Failed to initialize In-Memory MongoDB:', memError.message);
      throw memError;
    }
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
