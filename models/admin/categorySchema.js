const mongoose = require ('mongoose')

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },

})

module.exports = CategorySchema = mongoose.model('category',categorySchema)