import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectionBD = async () => {
  try {
    await mongoose.connect(process.env.BD_MONGO!, {});
    console.log('base de datos conectada');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default connectionBD;
