const userModel = require("../models/user/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const wishlistModel = require("../models/user/wishlistModel");
const cartModel = require("../models/user/cartModel");
const productModel = require("../models/admin/productModel");
const addressModel = require("../models/user/addressModel");
const bannerModel = require("../models/admin/bannerModel")
const categoryModel = require("../models/admin/categoryModel")
let v4;

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

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
    const cate = req.query.category
    console.log(cate);
    let category = await categoryModel.find({})
    let allProducts = await productModel.find()
    if(cate){
      let products = await productModel.find({category:cate});
      console.log(products);
      
      let banner = await bannerModel.find({})
      res.render("user/home", {category,allProducts,products, banner,v4:true});
    }else{
      let products = await productModel.find({}).limit(9)
      let category = await categoryModel.find({})
      let banner = await bannerModel.find({})
      res.render("user/home", {category,allProducts,products, banner,v4:true});
    }
  },

  landing:async(req,res)=>{
    let products = await productModel.find().limit(9)
    res.render("user/landing-page",{products,v4:false})
  },
  
  shop: async (req, res) => {
    const cate = req.query.category
    console.log(cate);
    let category = await categoryModel.find({})
    if(cate){
      let products = await productModel.find({category:cate});
      console.log(products);
      res.render("user/shop", {category,products,v4:true});
    }else{
      let products = await productModel.find({});
      let category = await categoryModel.find({})
      res.render("user/shop", {category,products,v4:true});
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
          console.log("hai");
        });
      } else {
        res.redirect("/login");
      }
    },
    resendOtp: async (req, res) => {
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
    },
  
    varifyOtp: async (req, res) => {
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
                console.log(newUser);
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
    },

    //landing products
    landingProducts: async(req,res)=>{
      const id = req.params.id;
      const singleProduct = await productModel.findById({_id: id});
      res.render("user/landingproduct", { singleProduct, v4:false });
    },
    

  //productDetails
  productDetails: async(req,res)=>{
    const id = req.params.id;
    const singleProduct = await productModel.findById({_id: id});
    res.render("user/product-details", { singleProduct, v4:true });
  },
  
  //wishList
  wishList: async(req, res) => {
  let user = req.session.user;
  let userId = user._id;
  return new Promise(async(resolve,reject)=>{
    let list = await wishlistModel.findOne({userId:userId}).populate("productId")
    .then((list)=>{
      if(list){
        resolve(list.productId)
      }else{
        resolve();
      }
    })
  }).then((list)=>{
    if(list){
      res.render("user/wishlist",{login:true, list, v4:true})
    }else{
      res.render("user/wishlist",{login:true,list: [],v4:true})
    }
  })
  },
 
// addto Wishlist
addtoWishList:async(req,res)=>{
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
  },
  // remove wishlist
  removeWishList:async(req,res)=>{
    const id = req.params.id;
    let user = req.session.user;
    let userId = user._id;
    await wishlistModel.findOneAndUpdate({userId:userId},{$pull :{ productId: id}})
    .then(()=>{
      res.redirect("/wishlist")
    })
  },

  // move to cart
  moveToCart:async(req,res)=>{
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
  },

  
      //profile
      profile:async(req,res)=>{
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
        res.render("user/profile" , {address,Index:1 ,user,v4:true})
      },
   
      //manage Address
      manageAddress:async(req,res)=>{
        let user = req.session.user;
        let userId = user._id;
        
        let address = await addressModel.findOne({userId:userId});
        

        if(address != null){
          if(address.address.length > 0){
            address = address.address
          }
          else{
            address = []
          }

          }
          else{
            address = []
          }

          res.render("user/manageAddress",{address,user, Index:1, v4:true})
        },
        //new address
        newAddress:async(req,res)=>{
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
      
        },
        //delete an address
        deleteAddress:async(req,res)=>{
          let user = req.session.user;
          let userId = user._id; 
          let addressId = req.params.id
          

          let address = await addressModel.findOneAndUpdate(
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
              res.redirect("/profile");
          });
      }catch{
          res.render("error")
      }
      }

      }


     

    
  



