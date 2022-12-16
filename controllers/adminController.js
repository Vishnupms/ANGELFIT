const adminModel = require("../models/admin/adminModel");
const bcrypt = require('bcrypt');
const userModel = require("../models/user/userModel");
const productModel = require("../models/admin/productModel");
const bannerModel = require("../models/admin/bannerModel")
const couponModel = require("../models/admin/couponModel")
const orderModel = require("../models/user/orderModel")
const moment = require("moment");
const categoryModel = require("../models/admin/categoryModel");


module.exports = {

    adminLogin: (req, res)=> {
        res.render("admin/admin-login")
    },

    adminHome: async (req, res) => {

      try{
      let userCount = await userModel.find({status:"UnBlocked"}).countDocuments()
      let productCount = await productModel.find({status:"listed"}).countDocuments()
      let sales = await orderModel.aggregate([
        {
          "$group":{
            '_id':null,
            'totalSales':{
              "$sum":"$total"
            }
          }
      }])
   
      let onlinePayments = await orderModel.aggregate([
        {
          "$match":{
            paymentMethod:"Razorpay"
          }
        },
        {
          "$group":{
            "_id":null,
            'totalOnlineSales':{
              "$sum":"$total"
            }
          }
        }
      ])
  
      let offlinePayments = await orderModel.aggregate([
        {
          "$match":{ 
            paymentMethod:"COD"
          }
        },
        {
          "$group":{
            "_id":null,
            'totalOfflineSales':{
              "$sum":"$total"
            }
          }
        }
      ])
  
      let totalSales = sales.map(a=> a.totalSales)
      let totalOnlineSales = onlinePayments.map(a=> a.totalOnlineSales)
      let offlinePay = offlinePayments.map(a=> a.totalOfflineSales)
    
      
      res.render("admin/admin-home", {userCount, productCount, totalSales , totalOnlineSales ,offlinePay });
    }catch{
      res.render("error")
    }
    },
  
    // adminSignup:(req,res)=> {
    //     res.render('admin/admin-signup')
    // },
    
    //-----------Admin Login-----------------
    login: async(req,res)=>{
      try{
        const{ email,password }= req.body;
        const admin = await adminModel.findOne({email})
        if(!admin){
            return res.redirect("/admin");
        }
        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch) {
            return res.redirect("/admin");
        } else {
           req.session.adminLogin = true
            res.redirect("/admin/dashboard");
        }
      }catch{
        res.render("error")
      }
    },
    // Admin-session
    adminSession: async (req, res, next) => {
      if (req.session.adminLogin) {
        next();
      } else {
        res.redirect("/admin");
      }
   
    },
    // logout
    logout: (req, res, next) => {
      if (req.session) {
        // delete session object
        req.session.destroy((err) => {
          if (err) {
            return next(err);
          } else {
            return res.redirect("/admin");
          }
        });
      }
    },
  
  

  


    //-------------------------------------------------------USER MANAGEMENT------------------------------------------------------
    //Show user section
    showUser: async(req,res,next)=>{
      try{
        let users = await userModel.find();
        res.render("admin/showUser", {users, index: 1});
      }catch{
        res.render("error")
      }
    },
    //block user
    blockUser : async(req,res)=>{
        const id = req.params.id
        await userModel.findByIdAndUpdate({_id:id},{$set:{status:"Blocked"}})
        .then(()=>{
            res.redirect('/admin/showUser')
        })
    },
    //unblock user
    unblockUser : async(req,res)=>{
         const id = req.params.id
        await userModel.findByIdAndUpdate({_id:id},{$set:{status:"UnBlocked"}})
        .then(()=>{
        res.redirect('/admin/showUser')
         })
     },
//----------------------------------------------------------PRODUCT MANAGEMENT--------------------------------------------
// addproduct
     newProduct:async(req,res)=>{
      try{
      console.log(req.body);
      const{ category, name, brand,description,price,status }= req.body
      const image = req.file
      console.log(image);
      const newProduct = productModel({
        category,
        name,
        brand,
        description,
        price,
        status,
        image:image.path,
      });
      await newProduct
      .save()
      .then(()=>{
        console.log(newProduct);
        res.redirect("/admin/showProducts")
      })
      .catch((err)=>{
        console.log(err.message);
        console.log(err);
      })
    }catch{
      res.render("error")
    }
    },
    

      //edit products
      updateProduct: async (req, res) => {
        try{
        const id = req.params.id;
        const { category, name,brand,description,price } = req.body;
        const image = req.file;
        console.log(req.file);
        const product = await productModel.updateOne(
          { _id: id },
          {
            $set: {
                category,
                name,
                brand,
                description,
                price,
                image:image.path,
                
            },
          }
        )
        .save().then(() => {
          res.redirect("/admin/showproducts");
        })}
        catch{
          res.render("error")
        }

     },
      //Show product section
    showProducts:async(req, res)=> {
      try{
     const product =  await productModel.find({})
     let category = await categoryModel.find({})
        res.render("admin/showProducts",{ product,category, index:1}  )
      }
      catch{
        res.render("error")
      }
    },

    editProductForm: async (req, res) => {
      const id = req.params.id;
      const singleProduct = await productModel.findOne({ _id: id });
      let category = await categoryModel.find();
      res.render("admin/editProducts", {
        singleProduct,
        category,
      });
    },
  

    //list products
    listProduct: async(req,res)=>{
        const id = req.params.id
        await productModel.findByIdAndUpdate({_id:id},{$set:{status:"listed"}})
        .then(()=>{
            res.redirect('/admin/showProducts')
        })

    },
    //unlist product
    unlistProduct: async(req,res)=>{
        const id = req.params.id
       await productModel.findByIdAndUpdate({_id:id},{$set:{status:"unlisted"}})
       .then(()=>{
       res.redirect('/admin/showProducts')
        })
    },
    //------------------------------------------------CATEGORY MANAGEMENT------------------------------------
    //show category
    showCategories: async (req, res) => {
      try{
      const category = await categoryModel.find({});
      res.render('admin/showCategory', { category, index: 1 })
    }
    catch{
      res.render("error")
    }
  },

  // new Category
  newCategory: async(req,res)=>{
    try{
    const category = req.body.category  
    const newCategory = categoryModel({category});
    newCategory.save().then((
      res.redirect("/admin/showCategory")
    ))
  }
  catch{
    res.render("error")
  }
  },
  // active category
  activeCategory: async (req, res) => {
    const id = req.params.id
    await categoryModel.findByIdAndUpdate({ _id: id }, { $set: { status: "active" } })
        .then(() => {
            res.redirect('/admin/showCategory')
        })
      },
      inActiveCategory: async (req, res) => {
        const id = req.params.id
        await categoryModel.findByIdAndUpdate({ _id: id }, { $set: { status: "inActive" } })
            .then(() => {
                res.redirect('/admin/showCategory')
            })
          },

//------------------------------------------------BANNER MANAGEMENT--------------------------------------------------------
// add banner
  newBanner: async (req, res) => {
    try{
    const { title, description } = req.body;
    const image = req.file;

    await new bannerModel({
      title,
      description,
      image: image.path,
    })
      .save()
      .then(() => {
        res.redirect("/admin/showBanner");
      });
    }
    catch{
      res.render("error")
    }
  },
  //showbanners page
  showBanner: async (req, res) => {
    try{
    let banner = await bannerModel.find({});
    res.render("admin/showBanner", { banner,index:1 });
  }
  catch{
    res.render("error")
  }
  },
  //deletebanner
  deleteBanner: async (req, res) => {
    try{
    const id = req.params.id;
    await bannerModel.findByIdAndDelete({ _id: id }).then(() => {
      res.redirect("/admin/showBanner");
    });
  }
  catch{
    res.render("error")
  }
  },
  //update Banner
  
  updateBanner: async (req, res) => {
    try{
    const id = req.params.id;
    const { title, description } = req.body;
    const image = req.file;
    const banner = await bannerModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title,
          description,

          image: image.path,
        },
      }
    );
    banner.save().then(() => {
      res.redirect("/admin/showBanner");
    });
  }
  catch{
    res.render("error")
  }


  //------------------------------------------------------COUPON MANAGEMENT---------------------------------------
  //show coupon

  },
  newCoupon: async(req,res)=>{
    try{
    const {name,code,discount} = req.body;
    await new couponModel({
      name,
      code,
      discount
    }).save()
    .then(()=>{
      res.redirect("back")
    })
  }
  catch{
    res.render("error")
  }
  },
  // Show coupons-
  showCoupon: async (req, res) => {
    try{
    let coupon = await couponModel.find({});
    res.render("admin/showCoupons", { coupon,index:1 });
  }
  catch{
    res.render("error")
  }
  },

  deleteCoupon: async(req,res)=>{
    const id = req.params.id;
    await couponModel.findByIdAndDelete({_id:id}).then(()=>{
      res.redirect("back")
    })
    
  },
  

  //-------------------------------------------------ORDER MANAGEMENT---------------------------------------------------
  showOrders :async (req , res) => {
    try{
   
      let user = await userModel.find()
      const orders =  await orderModel.find().sort({date:-1}).populate('products.productId').populate('userId')
      res.render('admin/showOrders' ,{orders,user,moment})
    }
    catch{
      res.render("error")
    }
       
    },
    //-----------------------------------------------change status------------------------------------------------------
  
    changeStatus: async (req, res) => {
      const { status, orderId, productId } = req.body;
      if (status == "Order Placed") {
        await orderModel.updateOne(
          { _id: orderId, "products.productId": productId },
          { $set: { "products.$.orderStatus": "Packed" } }
        );
      } else if (status == "Packed") {
        await orderModel.updateOne(
          { _id: orderId, "products.productId": productId },
          { $set: { "products.$.orderStatus": "Shipped" } }
        );
      } else if (status == "Shipped") {
        await orderModel.updateOne(
          { _id: orderId, "products.productId": productId },
          {
            $set: {
              "products.$.orderStatus": "Delivered",
              "products.$.paymentStatus": "Paid",
            },
          },
          { multi: true }
        );
      } else {
        await orderModel.updateOne(
          { _id: orderId, "products.productId": productId },
          {
            $set: {
              "products.$.orderStatus": "Cancelled",
              "products.$.paymentStatus": "Unpaid",
            },
          },
          { multi: true }
        );
      }
      res.json({ success: "success" });
    },


}



        
    