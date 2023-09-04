import { Router } from "express";
import { CreatePayment, CustomerLogin, CustomerSignUp, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOtp, VerifyOffer, addToCart, createOrder, getCart, getOrderById, getOrders } from "../controllers";
import { Authenticate } from "../middleware";

const router = Router()

// **--------------------- Signup/ Create Customer -------------------------**/
router.post('/signup',CustomerSignUp)

// **--------------------- Login -------------------------**/

router.post('/login',CustomerLogin)

router.use(Authenticate)
// **--------------------- Verify Customer Account -------------------------**/
router.patch('/verify',CustomerVerify)

// **--------------------- OTP/ Requesting OTP -------------------------**/
router.get('/otp',RequestOtp)

// **--------------------- Profile -------------------------**/
router.get('/profile',GetCustomerProfile)

router.patch('/profile',EditCustomerProfile)

// **--------------------- cart -----------------------------**/

router.post('/cart',addToCart);
router.get('/cart',getCart);

// **--------------------- Order ----------------------------**/
router.post('/createOrder',createOrder)
router.get('/orders',getOrders)
router.get('/order/:id',getOrderById)

//Apply Offers
router.get('/offer/verify/:id', VerifyOffer);


//Payment
router.post('/create-payment', CreatePayment);


export {router as CustomerRoute}
