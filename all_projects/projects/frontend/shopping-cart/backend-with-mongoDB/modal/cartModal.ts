import mongoose, { Schema, Document } from "mongoose";

interface CartI {
  productName: string;
  quantity: number
}

export interface CartInterface extends Document, CartI {}

const cartSchema: Schema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1
  }
});

export function cartModelGenerator() {
  return mongoose.model<CartInterface>("cart", cartSchema);
}



