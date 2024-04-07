import { model, Schema } from 'mongoose';

interface Product extends Document {
  name: string;
  category: string;
  country: string;
  price: number;
  status?: boolean;
  date_created: Date;
  user_created: string;
  date_update?: Date;
  user_update?: string;
}

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
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
});

export default model<Product>('Products', ProductSchema);
