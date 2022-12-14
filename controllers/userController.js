const userModel = require("../models/user/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const wishlistModel = require("../models/user/wishlistModel");
const cartModel = require("../models/user/cartModel");
const productModel = require("../models/admin/productModel");
const addressModel = require("../models/user/addressModel");
const bannerModel = require("../models/admin/bannerModel")
const categoryModel = require("../models/admin/categoryModel")


var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);


var Name;
var Email;
var Phone;
var Password;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: "angelfitnessecoms@gmail.com",
    pass: "sazgjfbgvnzowree",
  },  
});
module.exports = {
  userLogin: (req, res) => {
    res.render("user/login");
  },
  //show home
  userHome: async (req, res) => {
    try{
    const cate = req.query.category
      const user= req.session.user;
    let category = await categoryModel.find({})
    let allProducts = await productModel.find()
    if(cate && user){
      let products = await productModel.find({category:cate});
      
      
      let banner = await bannerModel.find({})
      res.render("user/home", {category,allProducts,products, banner,login:true});
    }else{
      let products = await productModel.find({}).limit(9)
      let category = await categoryModel.find({})
      let banner = await bannerModel.find({})
      res.render("user/home", {category,allProducts,products, banner,login:true});
    }
  }
  catch{
    res.render("error")
  }
  },

  landing:async(req,res)=>{
    try{
    let products = await productModel.find().limit(9)
    res.render("user/landing-page",{products,login:false})
  }
  catch{
    res.render("error")
  }
  },
  
  // shop page
  shop: async (req, res) => {
    try{
    const cate = req.query.category
    const page = parseInt(req.query.page) || 1;
    const items_per_page = 6;
    const totalproducts = await productModel.find({}).countDocuments()

 
    let category = await categoryModel.find({})
    if(cate){
      let products = await productModel.find({category:cate}).skip((page - 1) * items_per_page).limit(items_per_page)
    
      res.render("user/shop", {category,products,page,
        hasNextPage: items_per_page * page < totalproducts,
        hasPreviousPage: page > 1,
        PreviousPage: page - 1,totalproducts,login:true});
    }else{
      let products = await productModel.find({}).skip((page - 1) * items_per_page).limit(items_per_page)
      // let category = await categoryModel.find({})
      res.render("user/shop", {category,products, page,
        hasNextPage: items_per_page * page < totalproducts,
        hasPreviousPage: page > 1,
        PreviousPage: page - 1,totalproducts,login:true});
    }
  }
  catch{
    res.render("error")
  }
  },
  // signup: async (req, res) => {
  //   const { name, phone, email, password } = req.body;
  //   console.log("hai");
  //   let user = await userModel.findOne({ email });
  //   if (user) {
  //     console.log("user already exist");

  //     return res.redirect("/login");
  //   } else {
  //     const newUser = userModel({
  //       name,
  //       phone,
  //       email,
  //       password,
  //     });
  //     bcrypt.genSalt(10, (err, salt) => {
  //       bcrypt.hash(newUser.password, salt, (err, hash) => {
  //         if (err)
  //           throw err;
  //         newUser.password = hash;
  //         newUser
  //           .save()
  //           .then(() => {
  //             // console.log(newUser);
  //             req.session.user = newUser;
  //             res.redirect("/login");
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //             res.redirect("/login");
  //           });
  //       });
  //     });
  //   }
  // },
  //postLogin
  signin: async (req, res) => {
    try{
    const { email, password } = req.body;
    const user = await userModel.findOne({
      $and: [{ email }, { status: "UnBlocked" }],
    });
    if (!user) {
      return res.redirect("/login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/login");
    } else {
      req.session.user = user;
      req.session.userlogin = true;
      res.redirect("/home");
    }
  }
  catch{
    res.render("error")
  }
  },
  //session middleware
  userSession: (req, res, next) => {
    if (req.session.userlogin) {
      next();
    } else {
      res.redirect("/login");
    }
  },
  logout: (req, res, next) => {
    if (req.session) {
      // delete session object
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        } else {
          return res.redirect("/login");
        }
      });
    }
  },
    // DO_SIGNUP
    sendOtp: async (req, res) => {
      try{
      Email = req.body.email;
      Name = req.body.name;
      Phone = req.body.phone;
      Password = req.body.password;
      const user = await userModel.findOne({ email: Email });
  
      // send mail with defined transport object
      if (!user) {
        var mailOptions = {
          to: req.body.email,
          subject: "Otp for registration is: ",
          html:
            "<h3>OTP for account verification is </h3>" +
            "<h1 style='font-weight:bold;'>" +
            otp +
            "</h1>", // html body
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
          res.render("user/otp");
          
        });
      } else {
        res.redirect("/login");
      }
    }
    catch{
      res.render("error")
    }
    },
    resendOtp: async (req, res) => {
      try{
      var mailOptions = {
        to: Email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>", // html body
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render("user/otp");
      });
    }
    catch{
      res.render("error")
    }
      
    },
  
    varifyOtp: async (req, res) => {
      try{
      if (req.body.otp == otp) {
        const newUser = userModel({
          name: Name,
          email: Email,
          phone: Phone,
          password: Password,
        });
        await bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
               
                req.session.user = newUser;
                res.redirect("/login");
              })
              .catch((err) => {
                console.log(err);
                res.redirect("/login");
              });
          });
        });
      } else {
        res.render("user/otp");
      }
    }
    catch{
      res.render("error")
    }
    },

    //landing products
    landingProducts: async(req,res)=>{
      try{
      const id = req.params.id;
      const singleProduct = await productModel.findById({_id: id});
      res.render("user/landingproduct", { singleProduct });
    }
    catch{
      res.render("error")
    }
    },
    

  //productDetails
  productDetails: async(req,res)=>{
    try{
    const id = req.params.id;
    const singleProduct = await productModel.findById({_id: id});
    res.render("user/product-details", { singleProduct,login:true });
  }
  catch{
    res.render("error")
  }
  },
  
  //wishList
  wishList: async(req, res) => {
    try{
  let user = req.session.user;
  let userId = user._id;
    await wishlistModel.findOne({userId:userId}).populate("productId")
    .then((list)=>{
    if(list){
      res.render("user/wishlist",{login:true, list:list.productId})
    }else{
      res.render("user/wishlist",{login:true,list: []})
    }
  })
}
catch{
  res.render("error")
}
  },
 
// addto Wishlist
addtoWishList:async(req,res)=>{
  try{
  let productId = req.params.id;
  let user = req.session.user;
  let userId = user._id

    let wishlist = await wishlistModel.findOne({ userId: userId});
    if(wishlist){
      await wishlistModel.findOneAndUpdate(
        { userId: userId}, 
        { $addToSet: {productId: productId} }
      );
      // res.redirect("/home");
      res.json({status:true})

    }else {
      const wish = new wishlistModel({
        userId: userId,
        productId: [productId],
      });
      wish.save().then(()=>{
        res.json({status:true})
      });
    }
  }
  catch{
    res.render("error")
  }
  },
  // remove wishlist
  removeWishList:async(req,res)=>{
    try{
    const id = req.params.id;
    let user = req.session.user;
    let userId = user._id;
    await wishlistModel.findOneAndUpdate({userId:userId},{$pull :{ productId: id}})
    .then(()=>{
      res.json({success:true})
    })
  }
  catch{
    res.render("error")
  }
  },

  // move to cart
  moveToCart:async(req,res)=>{
    try{
    let user = req.session.user
    let userId = user._id
    let productId = req.params.id
    let product = await productModel.findById({_id: productId})
    let quantity = 1;
    let total = product.price * quantity
    let cart = await cartModel.findOne({userId:userId})


    if(cart){
      let exist = await cartModel.findOne({userId,"products.productId":productId})
      if(exist != null){
        await cartModel.findOneAndUpdate({userId:userId,"products.productId":productId},
            {
              $inc:{
                "products.$.quantity":1,
                "products.$.total": total,
                cartTotal : total
              },
            }
        ).then(async()=>{
          await wishlistModel.findOneAndUpdate({userId:userId},{$pull :{ productId: productId}})
        });
      }
      else{
        await cartModel.findOneAndUpdate({userId},
          {
            $push:{products:{productId,quantity ,total}},
            $inc:{cartTotal:total}
          }
          ).then(async()=>{
            await wishlistModel.findOneAndUpdate({userId:userId},{$pull :{ productId:productId}})
          });
      }
    }
    else{
        const newCart = new cartModel({
          userId:userId,
          products:[{productId,quantity,total}],
          cartTotal:total
        })
        newCart.save().then(async()=>{
          await wishlistModel.findOneAndUpdate({userId:userId},{$pull :{ productId: productId}})
        });
    }
    res.redirect("/cart")
  }
  catch{
    res.render("error")
  }
  },

  
      //profile
      profile:async(req,res)=>{
        try{
        let user = req.session.user;
        let userId = user._id;
        let address = await addressModel.findOne({userId:userId})
        if (address!= null){
          if(address.address.length > 0){
            address = address.address
          }
          else { address = []
          }
        }
        else {
          address = []
        }
        res.render("user/profile" , {address,Index:1 ,user,login:true})
      }
      catch{
        res.render("error")
      }
      },
   
     
        //new address
        newAddress:async(req,res)=>{
          try{
          let user = req.session.user;
          let userId = user._id;          
          const { fullName, houseName, city, state, pincode, phone} = req.body;
          let exist = await addressModel.findOne({userId:userId})
        
          if(exist){
            await addressModel.findOneAndUpdate({userId},
              {
                $push:{
                  address:{fullName, houseName, city, state, pincode,phone}
                },
              }
              
              ).then(()=>{
                res.redirect("/profile/manageAddress")
              });
          }
          else{
            const address = new addressModel({userId, 
              address:[{fullName,houseName,city,state,pincode,phone}]
            });
            
              await address
              .save()
              .then(()=>{
                res.redirect("/profile/manageAddress")
              })
              .catch((err)=>{
                console.log(err)
              })
          } 
        }
        catch{
          res.render("error")
        }
        },
        //delete an address
        deleteAddress:async(req,res)=>{
          let user = req.session.user;
          let userId = user._id; 
          let addressId = req.params.id
          

          await addressModel.findOneAndUpdate(
            {userId:userId},
            {$pull:{ address:{_id: addressId}}},

            ).then(()=>{
              res.redirect("/profile")
            });
        },
        
        editProfile: async (req, res) => {
          try{
          const userId = req.params.id;
          const { name, lastname, email, phone } = req.body;
          const saveUserEdits = await userModel.findOneAndUpdate(
              { _id: userId },
              {
                  $set: {
                      name,
                      lastname,
                      email,
                      phone,
                  },
              }
          );
          await saveUserEdits.save().then(() => {
              res.redirect("back");
          });
      }catch{
          res.render("error")
      }
      }

      }


     

    
  



