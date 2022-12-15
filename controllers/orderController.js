const addressModel = require("../models/user/addressModel")
const cartModel = require("../models/user/cartModel")
const orderModel = require("../models/user/orderModel")
const Razorpay = require("razorpay")
const moment = require("moment")
const { log } = require("console")

var instance = new Razorpay({
  key_id: "rzp_test_tf5Cb2ciSL0AeO",
  key_secret: "UxThv9CDA9dl5xX8BFq0VJvd",
});
  
module.exports = {
  
    checkOut:async(req,res)=>{
      try{
        let user = req.session.user;
          let userId = user._id;    
      
       let cart = await cartModel.findOne({userId:userId}).populate("products.productId")
       let count = await cartModel.find().countDocuments
       console.log(count);

       let address = await addressModel.findOne({userId})

       if(cart != null && cart.products.length > 0){
        let cartTotal = cart.cartTotal;
        let cartItems = cart.products;
        address = address ? address.address : 0;

        let length = address ? address.length: 0
        let index = req.body.index ? req.body.index : length -1;
        
        res.render("user/checkout",{cartTotal,count,cartItems,address,index,v4:true})
       }
       else{
        res.redirect("/cart")
       }
       }
        catch{
          res.render("error")
        }

    },
    // place an order
    placeOrder:async(req,res)=>{
      try{
        let userId = req.session.user._id
        let adrsIndex = req.body.index 
        let paymentMethod = req.body["paymentMethod"];
        let addresses = await addressModel.findOne({userId})
        let address = addresses.address[adrsIndex]
        let cart = await cartModel.findOne({userId})
        let cartId = cart._id
        let total = cart.cartTotal
        let products = cart.products
        // let orderId = newOrder._id;
        // total = newOrder.total
        if (paymentMethod == "COD") {
          const newOrder = new orderModel({
            userId,
            products,
            total,
            address,
            paymentMethod,
        });
        newOrder.save().then(async()=>{
            console.log(newOrder)
        });
            await cartModel.findByIdAndDelete({ _id: cart._id });
            res.json({ codSuccess: true });
          } else {
            return new Promise(async (resolve, reject) => {
              instance.orders.create(
                {
                  amount: total * 100,
                  currency: "INR",
                  receipt: "" + cartId,
                },
                function (err, order) {
                  resolve(order);
                }
              );
            }).then(async (response) => {
              res.json(response);
            });
          }
        }
        catch{
          res.render("error")
        }
    },
verifyPayment:async(req,res)=>{
  try{
  userId=req.session.user._id;
  let cart = await cartModel.findOne({userId})
  let products = cart.products
  let total = cart.cartTotal
  // add = add[1].split('=')
  // const addIndex = parseInt(add[1])
  const crypto = require("crypto");
  let details = req.body;
  console.log(details);
  let addresses = await addressModel.findOne({userId})
  let add = details['address'].split('=')
  console.log(add[1]);
  let address = addresses.address[add[1]]
  let hmac = crypto.createHmac("sha256", "UxThv9CDA9dl5xX8BFq0VJvd");
  console.log(hmac);
  hmac.update(
    details.payment.razorpay_order_id +
      "|" +
      details.payment.razorpay_payment_id
  );
  hmac = hmac.digest("hex");
  if(hmac === details.payment.razorpay_signature){
    let orderId = details.order.receipt
    const newOrder = new orderModel({
      userId,
      products,
      total,
      address,
      paymentMethod: "RazorPay"
  });
  newOrder.save().then(async()=>{
      console.log(newOrder)
  });
    await orderModel.findOneAndUpdate(
      {_id:orderId},                                         // set payment status :paid
      {$set:{paymentStatus:"paid"}}
    );
    await cartModel.findByIdAndDelete({_id:cart.id });       //deleting cart after payment
    res.json({status:true})
  }
  else{
    res.json({status:false})
  }
}
catch{
  res.render("error")
}
},




    //Checkout newAddress
    checkOutnewAddress:async(req,res)=>{
      try{
        let user = req.session.user;
        let userId = user._id; 
        const {fullName,houseName,city,state,pincode,phone} = req.body;
        let exist = await addressModel.findOne({userId:userId})

        if(exist){
            await addressModel.findOneAndUpdate({userId},
                {
                    $push:{
                        address:{fullName,houseName,city,state,pincode,phone}
                    }
                }
                ).then(()=>{
                    res.redirect("/checkout")
                });
        }
        else{
            const address = new addressModel({userId,
            address : [{fullName,houseName,city,state,pincode,phone}]
            });
            await address
            .save()
            .then(()=>{
                res.redirect("/checkout")
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
orders: async (req, res) => { 
  try{
  let userId = req.session.user._id;
  const page = parseInt(req.query.page) || 1;
  const items_per_page = 5;
  const totalproducts = await orderModel.find().countDocuments();
  const orders = await orderModel
    .find({userId:userId})
    .populate("products.productId").sort({date:-1})
    .skip((page-1)*items_per_page).limit(items_per_page)

    console.log(orders);
    if(orders){
      res.render("user/orders", { 
        v4:true, 
        moment,
        orders,
        index: 1,
        page,
        hasNextPage: items_per_page * page < totalproducts,
        hasPreviousPage: page > 1,
        PreviousPage: page - 1,
      });
    }else{
      res.render("user/orders",{ orders:[]});
    }
  }
        catch{
          res.render("error")
        }
},

orderSuccess:(req,res)=>{
  try{
    res.render("user/order-success")
    }
        catch{
          res.render("error")
        }
},

cancelOrder:async(req,res)=>{
  let productId= req.body.productId
  let response = await orderModel.updateOne(
    { _id: req.body['id'] , "products.productId":productId },
    { $set: { 'products.$.orderStatus': "Cancelled" } }
  );
  console.log(response);
  res.json({status:true})
}
}