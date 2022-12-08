
const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user',
    },
    productId:{    
        type: [mongoose.Schema.Types.ObjectId],
        required:true,
        ref:'product',

    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = wishlistModel = mongoose.model("wishlist",wishListSchema)