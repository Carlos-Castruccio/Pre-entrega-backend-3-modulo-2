import mongoose from 'mongoose';
import { ORDER_STATUS, ORDER_PRIORITY } from '../constants/index.js';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  address: { 
    type: String, 
    required: true, 
    trim: true 
  },
  
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  
  status: { 
    type: String, 
    enum: Object.values(ORDER_STATUS), 
    default: ORDER_STATUS.PENDING 
  },
  
  priority: { 
    type: String, 
    enum: Object.values(ORDER_PRIORITY), 
    default: ORDER_PRIORITY.NORMAL 
  }
},
 { timestamps: true, versionKey: false });

export const Order = mongoose.model('Order', orderSchema);
