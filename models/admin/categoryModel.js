const mongoose = require ('mongoose')

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    status:{
        type : String,
        default :"active"

    }

})

module.exports = Category = mongoose.model('Category',categorySchema)