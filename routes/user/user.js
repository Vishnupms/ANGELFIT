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
router.post('/signup',controller.signup)


router.get('/',controller.landing)
//product-details
router.get('/product-details/:id',controller.productDetails)

//otp-form
// router.get('/otp-validation',controller.otpValid)

//WISHLIST
router.get('/wishlist',controller.userSession,controller.wishList)
router.post('/addtowishlist/:id',controller.userSession,controller.addtoWishList)
router.get('/removeWishList/:id',controller.userSession,controller.removeWishList)
//move to cart
router.post('/moveToCart/:id',controller.userSession,controller.moveToCart)


//CART
router.get('/cart',controller.userSession,cartController.showCart);
//add to cart
router.post('/addtocart/:id',controller.userSession,cartController.addToCart); 
//qty inc
router.get('/quantityinc/:id/:price',controller.userSession,cartController.qtyInc);
//qty dec
router.get('/quantitydec/:id/:price',controller.userSession,cartController.qtyDec);
//removeCart
router.get('/removeCart/:id/:total',controller.userSession,cartController.removeCart);



//ADDRESS
router.get('/profile',controller.userSession,controller.profile) 
//manage Address
router.get('/profile/manageAddress',controller.userSession,controller.manageAddress)
// add new Address
router.post('/newAddress',controller.userSession,controller.newAddress)
//deleteAddress
router.get('/deleteAddress/:id',controller.userSession,controller.deleteAddress)



//ORDERS

//change address
router.post('/checkout', orderController.checkOut);
//checkout
router.get('/checkout',controller.userSession,orderController.checkOut)
//checkout new address
router.post('/checkOutnewAddress',controller.userSession,orderController.checkOutnewAddress)
//place Order
router.post('/placeOrder',controller.userSession,orderController.placeOrder)
//order-success
router.get('/orderSuccess',controller.userSession,orderController.orderSuccess)
//verify payment
router.post('/verifyPayment',controller.userSession,orderController.verifyPayment)
//orders
router.get('/orders',controller.userSession, orderController.orders)

//checkcoupon
router.post('/checkCoupon',controller.userSession,cartController. checkCoupen)











// router.route ('/login')
// .get(controller.userLogin)
// // .post(controller.postLogin)
// router.route('/signup')
//  .get(controller.userSignup)
// //  .post(controller.signup)

module.exports = router;
 
