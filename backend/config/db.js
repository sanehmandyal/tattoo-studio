import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

const DEFAULT_ATLAS_URI = 'mongodb+srv://sanehmandyal_db_user:ogCeU56GLTXWYdj9@cluster0.trkaywa.mongodb.net/tattoo-studio?retryWrites=true&w=majority';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 10,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (Persistent Cloud Atlas DB)`);
    mongoMemoryServer = null;
    return conn;
  } catch (error) {
    console.warn(`[Database] Standard MongoDB Atlas connection failed (${error.message}). Initializing In-Memory MongoDB Server for fallback operation...`);
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'tattoo-studio'
        }
      });
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] In-Memory MongoDB Server active at: ${memUri} (WARNING: Temporary RAM storage)`);
      return conn;
    } catch (memError) {
      console.error('[Database] Failed to initialize In-Memory MongoDB:', memError.message);
      throw memError;
    }
  }
};

export const getDbInfo = () => {
  const isMemory = Boolean(mongoMemoryServer);
  return {
    isPersistent: !isMemory,
    isMemory,
    host: mongoose.connection.host || 'unknown',
    database: mongoose.connection.name || 'tattoo-studio',
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    type: !isMemory ? 'MongoDB Atlas (Persistent Cloud)' : 'In-Memory RAM (Temporary Fallback)',
    whitelistRequired: isMemory,
  };
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
