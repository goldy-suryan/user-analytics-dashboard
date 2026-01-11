import mongoose from 'mongoose';
import { generateData } from './generateData.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/user_analytics';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected seeding data');

    await generateData();

    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
})();
