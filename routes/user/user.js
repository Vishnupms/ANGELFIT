const express = require("express");
const router = express.Router();
const controller = require('../../controllers/userController')
const cartController = require("../../controllers/cartController")
const orderController = require('../../controllers/orderController')
//home
router.get('/home',controller.userSession,controller.userHome);


// router.get('/home_view',controller.userview);
//login

router.get('/login',controller.userLogin)

router.post('/login',controller.signin)

//signup
router.post("/signup", controller.sendOtp);
router.post("/resendOtp", controller.resendOtp);
router.post("/varifyOtp", controller.varifyOtp);

router.get('/just-details/:id',controller.landingProducts)

//landing page
router.get('/',controller.landing)
//landing products
// logout
router.get("/logout", controller.logout);


//product-details
router.get('/product-details/:id',controller.productDetails)
//........................................................

router.post('/editProfile/:id',controller.editProfile);

router.use(controller.userSession)
//shop
router.get('/shop',controller.shop)

//WISHLIST

router.get('/wishlist',controller.wishList)
router.post('/addtowishlist/:id',controller.addtoWishList)
router.post('/removeWishList/:id',controller.removeWishList)
//move to cart
router.post('/moveToCart/:id',controller.moveToCart)


//CART
router.get('/cart',cartController.showCart);
//add to cart
router.post('/addtocart/:id',cartController.addToCart); 
//qty inc
router.post('/quantityinc/:id',cartController.qtyInc);
//qty dec
router.post('/quantitydec/:id',cartController.qtyDec);
//removeCart
router.get('/removeCart/:id/:total',cartController.removeCart);

//ADDRESS / PROFILE
router.get('/profile',controller.profile) 

// add new Address
router.post('/newAddress',controller.newAddress)
//deleteAddress
router.get('/deleteAddress/:id',controller.deleteAddress)
//edit profile


//ORDERS

//change address
router.post('/checkout', orderController.checkOut);
//checkout
router.get('/checkout',orderController.checkOut)
//checkout new address
router.post('/checkOutnewAddress',orderController.checkOutnewAddress)
//place Order
router.post('/placeOrder',orderController.placeOrder)
//order-success
router.get('/orderSuccess',orderController.orderSuccess)
//verify payment
router.post('/verifyPayment',orderController.verifyPayment)
//orders
router.get('/orders', orderController.orders)
//cancel order
router.post('/cancelOrder',orderController.cancelOrder)
//checkcoupon
router.post('/checkCoupon',cartController. checkCoupen)












// router.route ('/login')
// .get(controller.userLogin)
// // .post(controller.postLogin)
// router.route('/signup')
//  .get(controller.userSignup)
// //  .post(controller.signup)

module.exports = router;
 
