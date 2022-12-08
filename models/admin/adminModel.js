const mongoose = require ('mongoose');

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true
    
    },
    email :{
        type: String,
        required : true
    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        required: true

    }

    
})


module.exports = adminModel = mongoose.model('AdminData',adminSchema)