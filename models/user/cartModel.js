
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    products:{
        type: [
          {
            productId:{type: mongoose.Schema.Types.ObjectId, ref:'product'},
            quantity:{type:Number,default:1},
            total :{type:Number,required:true},
            date:{type: Date,default:Date.now}
          },
       ],
    },
    cartTotal:{
        type:Number,
    }, 
    offer:{
        couponId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"coupon"
        },
        discount:{
          type:Number,
          default:0
        }
      }
      
});

module.exports = cartModel = mongoose.model("Cart", cartSchema);
