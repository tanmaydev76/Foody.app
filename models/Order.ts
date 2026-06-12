import mongoose, { Schema, Document, Model } from 'mongoose';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  coupon: string;
  deliveryFee: number;
  taxes: number;
  total: number;
  address: string;
  phone: string;
  paymentMethod: string;
  orderId: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    id:       { type: Number, required: true },
    name:     { type: String, required: true },
    price:    { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 20 },
    image:    { type: String, default: '' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items:         { type: [OrderItemSchema], required: true },
    subtotal:      { type: Number, required: true, min: 0 },
    discount:      { type: Number, default: 0, min: 0 },
    coupon:        { type: String, default: '' },
    deliveryFee:   { type: Number, required: true, min: 0 },
    taxes:         { type: Number, required: true, min: 0 },
    total:         { type: Number, required: true, min: 0 },
    address:       { type: String, required: true },
    phone:         { type: String, required: true },
    paymentMethod: { type: String, required: true },
    orderId:       { type: String, required: true, unique: true },
    status:        { type: String, enum: ['placed','confirmed','preparing','out_for_delivery','delivered'], default: 'placed' },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
