//mongodb connect


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/AngelFit').then((res)=>{
    console.log('database connected');
})

