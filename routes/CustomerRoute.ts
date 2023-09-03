import { Router } from "express";
import { CustomerLogin, CustomerSignUp, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOtp, addToCart, createOrder, getOrderById, getOrders } from "../controllers";
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
router.get('/cart');
router.delete('/cart')
// **--------------------- Order ----------------------------**/
router.post('/createOrder',createOrder)
router.get('/orders',getOrders)
router.get('/order/:id',getOrderById)


export {router as CustomerRoute}
