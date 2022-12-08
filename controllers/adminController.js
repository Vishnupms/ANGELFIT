const adminModel = require("../models/admin/adminModel");
const bcrypt = require('bcrypt');
const userModel = require("../models/user/userModel");
const  Category = require("../models/admin/categorySchema")
const categorySchema = require("../models/admin/categorySchema");
const subcategorySchema = require("../models/admin/subcategorySchema");
const productModel = require("../models/admin/productModel");
const bannerModel = require("../models/admin/bannerModel")
const couponModel = require("../models/admin/couponModel")
const orderModel = require("../models/user/orderModel")
const moment = require("moment")


module.exports = {
    adminLogin: (req, res)=> {
        res.render("admin/admin-login")
    },
    adminHome:(req,res)=> {
        res.render('admin/admin-home')
    },
    // adminSignup:(req,res)=> {
    //     res.render('admin/admin-signup')
    // },
    
    login: async(req,res)=>{
        const{ email,password }= req.body;
        const admin = await adminModel.findOne({email})
        if(!admin){
            return res.redirect("/admin");
        }
        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch) {
            return res.redirect("/admin");
        } else {
            res.render("admin/admin-home");
        }
    },
    //Show user section
    showUser: async(req,res,next)=>{
        let users = await userModel.find();
        res.render("admin/showUser", {users, index: 1});
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
// addproduct
     newProduct:async(req,res)=>{
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
    },

      //edit products
      updateProduct: async (req, res) => {
        const id = req.params.id;
        const { category, name, brand,description,price } = req.body;
        const image = req.file;
        const product = await productModel.findByIdAndUpdate(
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
        );
        product.save().then(() => {
          res.redirect("/admin/showproducts");
        });
    

     },
      //Show product section
    showProducts:async(req, res)=> {
     const product =  await productModel.find({})
        res.render("admin/showProducts",{product, index:1}  )
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
        
    //show category
 


    //addcategory
//     addCategory:async(req,res)=>{
//         try{
//             const check_cat = await categorySchema.find({
//                 category:req.body.category
//             });
//             if(check_cat.length > 0){
//                 let checking = faslse;
//                 for(let i = 0;i < check_cat.length;i++){
//                     if(
//                         check_cat[i]["category"].toLowerCase()===
//                         req.body.category.toLowerCase()
//                     ){
//                         checking = true;
//                         break;
//                     }
//                 }
//                 if (checking === false){
//                     const category = new categorySchema({
//                         category:req.body.category,
//                     });
//                     const sub_cat_data = await category.save().then(()=>{
//                         res.redirect("/admin/login/category");
//                     });
//                 }else{
//                     res.redirect("/admin/login/category");
//                 }
//             }else{
//                 const category = new categorySchema({
//                     category:req.body.category,
//                 });
//                 const sub_cat_data = await category.save().then(()=>{
//                     res.redirect("/admin/login/category");
//             });
//         }
//     } catch(error){
//         res.status(400).send({success: false,mesg: error.message})
//     }
// }


  newBanner: async (req, res) => {
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
  },
  //showbanners page
  showBanner: async (req, res) => {
    let banner = await bannerModel.find({});
    res.render("admin/showBanner", { banner,index:1 });
  },
  //deletebanner
  deleteBanner: async (req, res) => {
    const id = req.params.id;
    await bannerModel.findByIdAndDelete({ _id: id }).then(() => {
      res.redirect("/admin/showBanner");
    });
  },
  //update Banner
  
  updateBanner: async (req, res) => {
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


  //coupon management
  //show coupon

  },
  newCoupon: async(req,res)=>{
    const {name,code,discount} = req.body;
    await new couponModel({
      name,
      code,
      discount
    }).save()
    .then(()=>{
      res.redirect("/admin/showCoupons")
    })
  },
  showCoupon: async (req, res) => {
    let coupon = await couponModel.find({});
    res.render("admin/showCoupons", { coupon,index:1 });
  },

  //order mngmnt
  showOrders :async (req , res) => {
   
      let user = await userModel.find()
      const orders =  await orderModel.find().sort({date:-1}).populate('products.productId').populate('userId')
      res.render('admin/showOrders' ,{orders,user,moment})

       
    },
  
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



        
    