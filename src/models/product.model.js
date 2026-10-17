import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../constants/index.js';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    default: '', 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  status: { 
    type: String, 
    required: true, 
    enum: Object.values(PRODUCT_STATUS) 
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

export const Product = mongoose.model('Product', productSchema);
