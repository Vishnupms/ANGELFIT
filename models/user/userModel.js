
const mongoose = require("mongoose");

const Userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true
    },
    lastname:{
      type: String,
      required:false
    },

    phone: {
      type: Number,
      required:true
    },


    email: {
      type: String,
      lowercase: true,
      required:true,
      unique: true

     
    },
 
    password: {
      type: String,
      required:true
    },
    status: {
      type: String,
      default: "UnBlocked"
    },
 


    // IsVerified: {
    //   type: Boolean, 
    //   default: false,
    // },
  },
  // { timestamps: true }
);
module.exports = userModel = mongoose.model("user", Userschema);