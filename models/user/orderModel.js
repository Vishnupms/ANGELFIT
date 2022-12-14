const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref:"user"
  },
  products: [
    {
      productId: { type: ObjectId, ref: "product" },
      quantity: { type: Number },
      total: { type: Number, required: true },
      paymentStatus: {
        type: String,
        default: "Pending",
        
      },
      orderStatus: {
        type: String,
        default: "Order Placed",
        enum: ["Order Placed", "Packed",  "Shipped", "Delivered", "Cancelled"],
      },

    },
  ],
  total: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0
  },
  address: {
    type: ObjectId,
    required: true,
    ref:"addresses"
  },
  paymentMethod: {
    type: String,
    required: true,
  },
 
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = orderModel = mongoose.model("order", orderSchema);