//mongodb connect
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:'./.env'})
// eslint-disable-next-line no-undef
const db = process.env.DATABASE
mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('database connected')
})

