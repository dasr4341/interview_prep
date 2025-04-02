import mongoose, { Schema } from "mongoose";
const cartSchema = new Schema({
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
    return mongoose.model("cart", cartSchema);
}
//# sourceMappingURL=cartModal.js.map