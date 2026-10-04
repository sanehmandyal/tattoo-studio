import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedInitialData } from './utils/seeder.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Check and seed default master data if needed
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(` 🔥 LAND OF GOD TATTOO STUDIO BACKEND ON PORT ${PORT} 🔥`);
      console.log(` 🌐 API Health: http://localhost:${PORT}/api/health`);
      console.log(` 🛡️  Master Admin: ${process.env.ADMIN_EMAIL || 'admin@landofgod'} (Credentials secured in .env)`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start INK CARVERS backend server:', err);
    process.exit(1);
  }
};

startServer();
