import express,{Request,Response,NextFunction} from 'express'

import {plainToClass} from 'class-transformer'

import { CreateCustomerInputs, EditCustomerProfileInputs, OrderInputs, UserLoginInputs } from '../dto/Customer.dto'
import { validate } from 'class-validator'
import { Customer } from '../models/Customer'
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword, onRequestOTP } from '../utility'
import { Food } from '../models'
import { Order } from '../models/Order'
import { Transaction } from '../models/Transaction'
import { Offer } from '../models/Offer'
 
export const CustomerSignUp = async(req : Request,res : Response,next : NextFunction) => {
    
    const customerInputs = plainToClass(CreateCustomerInputs,req.body)

    const inputErrors = await validate(customerInputs,{validationError : {target : true}})

    if(inputErrors.length > 0)
    {
        return res.status(400).json(
            {
                inputErrors,
                status:false
            }
        )
    }

    const {email,phone,password} = customerInputs

    const existedCustomer = await Customer.findOne({email:email})

    if(existedCustomer!== null){
        return res.status(409).json(
            {
                message : 'An user exist with the provided email ID'
            }
        )
    }

    const salt = await GenerateSalt()
  
    const userPassword = await GeneratePassword(password,salt)

    const {otp,expiry} = GenerateOtp()

    const result = await Customer.create(
        {
            email,
            password : userPassword,
            salt,
            otp,
            otp_expiry:expiry,
            firstName : '',
            lastName : '',
            address : '',
            phone : phone,
            verified : false,
            lat :0,
            lng : 0,
            orders : []
        }
    )
    if(result) {
      
        // send the otp to customer
        await onRequestOTP(otp,phone)

        // generate the signature
        const signature = GenerateSignature({
            _id:result._id,
            email : result.email,
            verified : result.verified
        })

        return res.status(201).json(
            {
                signature : signature,verified : result.verified ,email : result.email
            }
        )
    }

    res.status(400).json(
        {
            message : 'error with signup',
            success : false
        }
    )

}
export const CustomerLogin = async(req : Request,res : Response,next : NextFunction) => {

    const loginInputs = plainToClass(UserLoginInputs,req.body)

    const loginErrors = await validate(loginInputs,{validationError : {target : false}})

    if(loginErrors.length>0){
        return res.status(400).json({
            loginErrors
        })
    }

    const {email,password} = loginInputs;

    const customer = await Customer.findOne({email:email})

    if(customer){
    const validation = await ValidatePassword(password,customer?.password);

    if(validation){
        const signature = GenerateSignature({
            _id: customer._id,
            email: customer.email,
            verified: customer.verified
        })

        return res.status(200).json({
            signature,
            email: customer.email,
            verified: customer.verified
        })
    }
    
}

return res.json({ msg: 'Error With Signup'});

}
export const CustomerVerify = async(req : Request,res : Response,next : NextFunction) => {

    const {otp} = req.body;

    const customer = req.user;

    if(customer){
    const profile = await Customer.findById(customer._id);

    if(profile){

        if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date())
        {
            profile.verified = true;
            const updatedProfile = await profile.save()

            const signature = GenerateSignature(
                {
                    _id : updatedProfile._id,
                    email : updatedProfile.email,
                    verified : updatedProfile.verified
                }
            )

            return res.status(201).json(
                {
                    signature,
                    verified : updatedProfile.verified,
                    email : updatedProfile.email
                }
            )

        }
    }
    }
    return res.status(400).json({ msg: 'Unable to verify Customer'});

}
export const RequestOtp = async(req : Request,res : Response,next : NextFunction) => {

    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id);

        if(profile){

            const {otp,expiry} = GenerateOtp()
            
            profile.otp = otp;
            profile.otp_expiry = expiry;
            await profile.save()

            await onRequestOTP(otp,profile.phone)

           return res.status(200).json({message : 'OTP sent to your registered phone number'})

        }
    }

    return res.status(400).json({message : 'error with request OTP'})
}
export const GetCustomerProfile = async(req : Request,res : Response,next : NextFunction) => {

    const customer = req.user;

    if(customer){
        const customerProfile = await Customer.findById(customer._id);

        if(customerProfile){

            return res.status(200).json({
                customerProfile,
                success : true
            })
        }
    }
    return res.status(400).json(
        {
            message : 'error in getting Profile',
            success : false
        }
    )
    }
export const EditCustomerProfile = async(req : Request,res : Response,next : NextFunction) => {

    const customer = req.user;

    const profileInputs = plainToClass(EditCustomerProfileInputs,req.body)

    const profileErrors = await validate(profileInputs,{validationError : {target : true}})

    if(profileErrors.length>0){
        return res.status(400).json(
            {
                profileErrors,
                success : false
            }
        )
    }

    const {firstName,lastName,address} = profileInputs

    if(customer){
        const customerProfile = await Customer.findById(customer._id);

        if(customerProfile){
            customerProfile.firstName = firstName;
            customerProfile.lastName = lastName;
            customerProfile.address = address
            
           const result = await customerProfile.save()

           return res.status(200).json({
            result,
            success : true
           })
        }

    }

    return res.status(400).json(
        {
            message : 'error in editing Profile',
            success : false
        }
    )

}

// cart section

export const getCart = async(req: Request,res: Response, next: NextFunction) => {

    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate('cart.food');

        if(profile != null){
          const cartFoods = profile.cart
          return res.status(200).json(
            {
                message : 'foods in your cart fetched successfully',
                data : cartFoods
            }
          )
        }
        else{
            return res.status(404).json(
                {
                    message: 'profile not found'
                }
            )
         }
    }
    else{
        return res.status(404).json({message : 'customer not found'})
    }


}

export const addToCart = async(req: Request,res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer){
     const profile = await Customer.findById(customer._id);
     let cartItems = Array();

     const {_id,units} = <OrderInputs>req.body;
     const food = await Food.findById(_id);
     
     if(profile != null){

        // check for cart items
     cartItems = profile.cart;
     
     if(cartItems.length > 0){
        
        let existingItems = cartItems.find(item => {
           return item.food.toString() === _id.toString();
        })
        if(units > 0){
            cartItems = cartItems.filter(item => {
                return item.food.toString() !== _id.toString();
             })
             cartItems.push({food,units});

        }
        else{
            cartItems = cartItems.filter(item => {
                return item.food.toString() !== _id.toString()
             })
             profile.cart = [...cartItems] as [any]
             await profile.save();
             return res.status(200).json({})
        }
     }
     else{        
        cartItems.push({food,units})
     }
    //  console.log(cartItems);
    //  console.log(...cartItems);
     
     profile.cart = [...cartItems] as [any]
     await profile.save();
     return res.status(200).json({
        message : 'food items added to cart',
        success: true
    })
     }
     else{
        return res.status(404).json(
            {
                message: 'profile not found'
            }
        )
     }
    }
    else{
        return res.status(400).json({message : 'Unable to create cart'})
    }
}

export const createOrder = async(req:Request,res : Response,next : NextFunction) => {
    const customer = req.user;

    if(customer){
        const orderId = `${Math.floor(Math.random()*89999) + 1000}`;

        const profile = await Customer.findById(customer._id);

        if(profile){

            const cart = <[OrderInputs]>req.body;
            
            let cartItems = Array()
            
            let netAmount = 0.0;
            
            const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec()
            
            foods.map(food => {
                cart.map(({_id,units}) =>{
                    if((food._id).toString() === _id){
                        netAmount += (food.price * units)
                        cartItems.push({food,units})
                    }
                } )
            }
            )
            
            if(cartItems){
                const currentOrder = await Order.create(
                    {
                        orderId : orderId,
                        items : cartItems,
                        totalAmount : netAmount,
                        orderDate : new Date(),
                        paidThrough : 'COD',
                        paymentResponse : '',
                        orderStatus : 'waiting'
                    })
                    
                    if(currentOrder){
                        profile?.orders.push(currentOrder)
                        
                        const profileResponse = await profile.save()

                        return res.status(200).json(
                            {
                              profileResponse,
                              success : true  
                            }
                        )
                        
                    }

             }
            
        }
         }

    }


export const getOrders = async(req : Request,res : Response,next : NextFunction) => {

    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id).populate('orders')

        if(profile){
          return  res.status(200).json(
                {
                    message : 'Successfully got orders of the login customer',
                    allOrders : profile.orders,
                    success : true
                }
            )
        }
    }

    return res.status(400).json({
        message : 'error in getting orders',
        success : false
    })
}

export const getOrderById = async(req : Request,res : Response,next : NextFunction) => {

    const orderId = req.params.id;
    
    if(orderId){

        const order = await Order.findById(orderId).populate('items.food');

        if(order){
            return res.status(200).json({
                success : true,
                order
            })
        }

    }

    return res.status(400).json({
        message : 'error with orderId',
        success : false
    })

}

export const VerifyOffer = async (req: Request, res: Response, next: NextFunction) => {

    const offerId = req.params.id;
    const customer = req.user;
    
    if(customer){

        const appliedOffer = await Offer.findById(offerId);
        
        if(appliedOffer){
            if(appliedOffer.isActive){
                return res.status(200).json({ message: 'Offer is Valid', offer: appliedOffer});
            }
        }

    }

    return res.status(400).json({ msg: 'Offer is Not Valid'});
}


export const CreatePayment = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    const { amount, paymentMode, offerId} = req.body;

    let payableAmount = Number(amount);

    if(offerId){

        const appliedOffer = await Offer.findById(offerId);

        if(appliedOffer?.isActive){
            payableAmount = (payableAmount - appliedOffer.offerAmount);
        }
    }
    // perform payment gateway charge api

    // create record on transaction
    const transaction = await Transaction.create({
        customer: customer?._id,
        vendorId: '',
        orderId: '',
        orderValue: payableAmount,
        offerUsed: offerId || 'NA',
        status: 'OPEN',
        paymentMode: paymentMode,
        paymentResponse: 'Payment is cash on Delivery'
    })


    //return transaction
    return res.status(200).json(transaction);

}