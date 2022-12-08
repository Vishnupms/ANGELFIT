
const mongoose = require ('mongoose')

const subCategorySchema = new mongoose.Schema({
   category_id: {
       type: mongoose.Schema.Types.ObjectId,
       ref:'category'
    },
    subCategory:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        default:true
    },
})

module.exports = mongoose.model('Subcategory',subCategorySchema )