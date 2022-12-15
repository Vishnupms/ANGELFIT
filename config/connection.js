//mongodb connect
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:'./.env'})
const db = process.env.DATABASE
mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then((res)=>{
    console.log('database connected')
})

