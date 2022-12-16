const express = require("express");
const { collection } = require("../../models/admin/adminModel")
const controller = require('../../controllers/adminController');
const { showBanner } = require("../../controllers/adminController");
const router = express.Router();

//admin login
router.get('/',controller.adminLogin);
router.post('/',controller.login)
router.get("/logout", controller.logout);



//admin dash
router.use(controller.adminSession)
router.get('/dashboard',controller.adminHome)


//show user list
router.get('/showUser',controller.showUser)
//block user
router.post('/blockUser/:id',controller.blockUser)
//unblock user
router.post('/unblockUser/:id',controller.unblockUser)


//show category
router.get('/showCategory',controller.showCategories)
//add category
router.post('/newCategory',controller.newCategory)
//active category
router.post('/activeCategory/:id',controller.activeCategory)
//inactive category
router.post('/inActiveCategory/:id',controller.inActiveCategory)

//show product list
router.get('/showProducts',controller.showProducts)
router.post('/add-product',controller.newProduct)
//list product
router.post('/listProduct/:id',controller.listProduct)
//unlist product
router.post('/unlistProduct/:id',controller.unlistProduct)
//edit products
router.post('/updateProduct/:id',controller.updateProduct)
router.post('/editProducts/:id',controller.editProductForm)


//BANNER
//show banner
router.get('/showBanner',controller.showBanner)
//add banner
router.post('/add-banner',controller.newBanner)
//delete Banner
router.post('/deleteBanner/:id',controller.deleteBanner)
//update Banner
router.post('/updateBanner/:id', controller.updateBanner)

//COUPONS
router.get('/showCoupon',controller.showCoupon)
//add coupon
router.post('/add-coupon',controller.newCoupon)
//delete coupon
router.post('/deleteCoupon/:id',controller.deleteCoupon)

//show orders
router.get('/showOrders',controller.showOrders)

//change status
router.post('/changeStatus',controller.changeStatus)









//admin-signup
// router.get('/signup',controller.adminSignup)
// router.post('/admin-signup',controller.signup)


module.exports = router; 
  