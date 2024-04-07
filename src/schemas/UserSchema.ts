import { model, Schema } from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  password: string;
  status: boolean;
  date_created: Date;
  user_created: string;
  date_update?: Date;
  user_update?: string;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
  user_created: {
    type: String,
    default: 'admin',
  },
  date_update: {
    type: Date,
  },
  user_update: {
    type: String,
  },
});

export default model<User>('Users', UserSchema);
