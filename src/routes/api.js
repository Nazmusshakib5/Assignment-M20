const express=require('express')
const ProductController=require('../controllers/ProductController')
const UserController=require('../controllers/UserController')
const WishController=require('../controllers/WishController')
const CartController=require('../controllers/CartController')
const InvoiceController=require('../controllers/InvoiceController')
const FeatureController=require('../controllers/FeatureController')
const authMiddleWare=require('../middlewares/authMiddleWare')

const router=express.Router()

//Product Related Routes
router.get('/ProductBrandList',ProductController.ProductBrandList)
router.get('/ProductCategoryList',ProductController.ProductCategoryList)
router.get('/ProductSliderList',ProductController.ProductSliderList)
router.get('/ProductListByBrand/:BrandID',ProductController.ProductListByBrand)
router.get('/ProductListByCategory/:CategoryID',ProductController.ProductListByCategory)
router.get('/ProductListBySimilar/:CategoryID',ProductController.ProductListBySimilar)
router.get('/ProductListByKeyword/:Keyword',ProductController.ProductListByKeyword)
router.get('/ProductListByRemark/:Remark',ProductController.ProductListByRemark)
router.get('/ProductDetails/:ProductID',ProductController.ProductDetails)
router.get('/ProductReviewList/:ProductID',ProductController.ProductReviewList)



//User Related Routes
router.get('/UserOtp/:email',UserController.UserOtp)
router.get('/VerifyLogin/:email/:otp',UserController.VerifyLogin)
router.get('/UserLogout',authMiddleWare,UserController.UserLogout)
//User After Login Profile manage
router.post('/CreateProfile',authMiddleWare,UserController.CreateProfile)
router.post('/UpdateProfile',authMiddleWare,UserController.UpdateProfile)
router.get('/ReadProfile',authMiddleWare,UserController.ReadProfile)


//wish List
router.post('/SaveWishList',authMiddleWare,WishController.SaveWishList)
router.post('/RemoveWishList',authMiddleWare,WishController.RemoveWishList)
router.get('/WishList',authMiddleWare,WishController.ReadWishList)


//Cart List
router.post('/SaveCartList',authMiddleWare,CartController.SaveCartList)
router.post('/RemoveCartList',authMiddleWare,CartController.RemoveCartList)
router.get('/ReadCartList',authMiddleWare,CartController.ReadCartList)
router.post('/UpdateCartList/:cartId',authMiddleWare,CartController.UpdateCartList)


//Invoice and Payment
router.get('/CreateInvoice',authMiddleWare,InvoiceController.CreateInvoice)
router.get('/InvoiceList',authMiddleWare,InvoiceController.InvoiceList)
router.get('/InvoiceProductList/:invoice_id',authMiddleWare,InvoiceController.InvoiceProductList)

router.post('/PaymentSuccess/:transID',InvoiceController.PaymentSuccess)
router.post('/PaymentFail/:transID',InvoiceController.PaymentFail)
router.post('/PaymentCancel/:transID',InvoiceController.PaymentCancel)
router.post('/PaymentIPN/:transID',InvoiceController.PaymentIPN)

//FeatureList
router.get('/FeaturesList',FeatureController.FeaturesList)

//Create Review
router.post('/CreateReview',authMiddleWare,ProductController.CreateReview)

module.exports=router;