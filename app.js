//js
const express = require('express');
const app = express();
const path = require('path')
const multer = require("multer")
const session = require('express-session')
const cookieParser = require('cookie-parser')

const adminRouter = require('./routes/admin/admin')
const userRouter = require('./routes/user/user')


app.use(cookieParser());

const mongoose = require('mongoose')
const db = require("./config/connection")
const ejs = require('ejs');
const { log } = require('console');



app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')


app.use(express.json())
app.use(express.urlencoded({extended:true}))

//multer setup
const fileStorage = multer.diskStorage({
    destination:(req, file, cb)=> {
        cb(null, "public/dbimages");
    },
    filename:(req,file,cb)=>{
        console.log(file);
        cb(
            null,
            file.fieldname +"-"+Date.now() + path.extname(file.originalname)
        );
    },
});
app.use(
    multer({
        dest:"public/dbimages",
        storage:fileStorage
    }).single("image")
);


app.use(express.static(path.resolve(__dirname, "/public")))
app.use('/public',express.static('public'))

// session start
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "secret-key",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: true
}));

app.use('/admin',adminRouter)
app.use('/',userRouter)
app.use("*",(req,res)=>{
    res.render('error');
  })    


app.listen(5000, console.log("Server started: 5000"))


