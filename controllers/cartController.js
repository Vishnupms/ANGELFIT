const couponModel = require("../models/admin/couponModel");
const productModel = require("../models/admin/productModel")
const cartModel = require("../models/user/cartModel")


module.exports = {

 // SHOW CART
 showCart: async(req,res)=>{
  try{
      let user = req.session.user;
      let userId = user._id;
    
    let cart = await cartModel
     .findOne({userId: userId})
     .populate("products.productId");
    
    if(cart){
      let products = cart.products;
      let cartTotal = cart.cartTotal;
      


      res.render("user/cart", {products,cartTotal,v4:true});
    } else {
      res.render("user/cart", {products: [],v4:true});
    }
  }
  catch{
    res.render("error")
  }
    },
     //add to cart
     addToCart: async(req,res)=> {
      try{
        let user = req.session.user
        let userId = user._id
        let productId = req.params.id
        let product = await productModel.findById({_id : productId})
        let quantity = req.body.quantity ? req.body.quantity : 1
        total = product.price * parseInt(quantity); 
  
        let cart = await cartModel.findOne({userId:userId})
  
        if(cart){
          let exist = await cartModel.findOne({userId:userId,"products.productId":productId})
        if(exist!= null){
          await cartModel.findOneAndUpdate({userId:userId,"products.productId":productId},
          {
            $inc:{
              "products.$.quantity":1,
              "products.$.total":total,
              cartTotal:total
            },
            userId:userId
          }
          );
        } else {
          await cartModel.findOneAndUpdate({userId:userId},
            {
            $push:{products:{productId,quantity,total}},
            $inc:{cartTotal:total},
            }
            );
          }
        } else{
          const newCart = new cartModel({
            userId : userId,
            products:[{ productId, quantity, total }],
            cartTotal:total
          })
          newCart.save();
        }
        res.json({success:true});
      }
      catch{
        res.render("error")
      }
  
  
      },
        // remove cart
        removeCart:async(req,res)=>{
          try{
          const productId=req.params.id
          let userId= req.session.user._id
          let total = parseInt(req.params.total);
          console.log(total)
         
          await cartModel.findOneAndUpdate({userId:userId},
                           {
                            $pull:{products: {productId}},
                            $inc:{
                              cartTotal: -total,
                            },
                        }
            )
          .then(()=>{
            res.redirect("/cart")
          })
        }
        catch{
          res.render("error")
        }
  
        },
          //quantitiy inc
    qtyInc:async(req,res)=>{
        let user = req.session.user;
        let userId = user._id;
        let productId = req.params.id
        let price = parseInt(req.params.price)
        let product = await productModel.findById(productId)
        
        let cart = await cartModel.findOneAndUpdate(
          {userId:userId,"products.productId":productId},

          { 
            $inc: {
                "products.$.quantity":1,
                "products.$.total":product.price,
                cartTotal:product.price
               
            },
        }
          )
          .then(()=>{
            res.redirect("back")
          })
        },
         // qty decrement
    qtyDec:async(req,res)=>{
        let userId = req.session.user._id
        let productId = req.params.id
        let product = await productModel.findById(productId)
        let price = req.params.price
        let quantity = req.body.quantity
        let cart = await cartModel.findOneAndUpdate(

          {userId:userId,"products.productId":productId},
         
          {
             $inc: {
              "products.$.quantity":-1,
              "products.$.total":-product.price,
              cartTotal:-product.price
            }
            }
          ).then(()=>{
         
            res.redirect("back")
          })
        },

        checkCoupen: async (req, res) => {
          
          try {
            
            const userId = req.session.user._id;
            const couponCode = req.body.code;
            const cartTotal = req.body.cartTotal;
            const confirmCode = await couponModel.findOne({ code: couponCode });
            console.log(confirmCode);
            if (confirmCode) {
              const existOffer = await cartModel.findOne({userId:userId})
              if (!existOffer.offer.couponId){
              discountCoupen = Math.round(cartTotal * confirmCode.discount/ 100) 
              console.log(discountCoupen);
              const cart = await cartModel.findOneAndUpdate(
                { userId: userId },
                {
                  $set: {
                    offer:{couponId: confirmCode._id, 
                    discount : discountCoupen},
                
                  },
                  $inc: { cartTotal: -discountCoupen },
                },{multi : true}
              );
              res.json({apply:true});
              }else{
                res.json({exist : true})
              }
            }else{
              res.json({apply : false})
            }
          }
          catch{
            res.render("error")
          }
        },




}