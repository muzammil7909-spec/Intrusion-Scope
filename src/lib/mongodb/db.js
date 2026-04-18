import mongoose from 'mongoose';
import Admin from '@/models/Admin';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };


    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      // Seed initial admin if provided in env
      await seedAdmin();
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) return;

  try {
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log(`Seeding initial admin: ${adminEmail}`);
      await Admin.create({
        email: adminEmail,
        password: adminPassword, // The model's pre-save hook will hash this
      });
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

export default dbConnect;
