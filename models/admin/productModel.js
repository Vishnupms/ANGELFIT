const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    
    category:{
        type: String,
        required:true,
        ref:"subCategory"
       
    },
    subCategory:{
        type: String,

       
    },
    name: {
        type:String,
        required:true
    },
    brand: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    price: {
        type:String,
        required:true
    },
    image: {
        type:String,
        required:true
    },
    status: {
        type:String,
        required:true,
        default:"listed"
    }
});

module.exports = productModel = mongoose.model("product",productSchema);