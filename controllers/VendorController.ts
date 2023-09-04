import {Request,Response,NextFunction} from 'express'
import { CreateFoodInput, EditVandorInput, VendorLoginInput } from '../dto'
import { FindVendor } from './AdminController'
import { GenerateSignature, ValidatePassword } from '../utility'
import { Food,Order } from '../models'


export const VendorLogin = async(req:Request,res:Response,next:NextFunction) => {
  const {email,password} = <VendorLoginInput>req.body

  const existingVendor = await FindVendor('',email);
   
  const savedPassword = existingVendor?.password
  if(existingVendor !== null){
    const validation = await ValidatePassword(password,savedPassword)

    if(validation){
      const signature = GenerateSignature(
        {
          _id : existingVendor.id,
          email : existingVendor.email,
          name : existingVendor.name,
          foodTypes : existingVendor.foodType
        }
      )
      return res.json(signature);
    }
    else{
      return res.json({message : 'Password is not valid'})
    }

    
  }
  return res.status(400).json({
    message : 'Login credentials not valid'
  })
}

export const GetVendorProfile = async(req:Request,res : Response,next : NextFunction) => {
  
  const {user} = req

  if(user){
    return res.status(200).json(
      {
        message : 'profile fetched successfully',
        user
      }
    )
  }
  return res.status(400).json(
    {
      message : 'user not found'
    }
  )
}
export const UpdateVendorProfile = async(req:Request,res : Response,next : NextFunction) => {

  const {name,phone,address,foodType} = <EditVandorInput>req.body

  const {user} = req;

  if(user){
    const existingVendor = await FindVendor(user._id)

    if(existingVendor !== null){

      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodType

      const savedResult = await existingVendor.save()

      return res.json(savedResult)
    }
  }
  return res.status(400).json(
    {
      message : 'Vendor information not found'
    }
  )
}
export const UpdateVendorService = async(req:Request,res : Response,next : NextFunction) => {

  const {user} = req;

  if(user){
    const existingVendor = await FindVendor(user._id)

    if(existingVendor !== null){

      existingVendor.serviceAvailable = !existingVendor.serviceAvailable

      const savedResult = await existingVendor.save()

      return res.json(savedResult)
    }
  }
  return res.status(400).json(
    {
      message : 'Vendor information not found'
    }
  )
}

export const AddFood = async(req : Request,res:Response,next : NextFunction) => {

  const user = req.user;

  if(user){

    const {name,description,category,foodType,readyTime,price} = <CreateFoodInput>req.body;

    const vendor = await FindVendor(user._id);

    if(vendor !== null){

      const files = req.files as [Express.Multer.File]

      const images = files.map((file : Express.Multer.File) => file.filename )
      const createdFood = await Food.create(
        {
          name,
          vendorId : vendor._id,
          description,
          category,
          foodType,
          readyTime,
          price,
          rating : 0,
          images : images
        }
      )
      vendor.foods.push(createdFood)

      const result = await vendor.save()

      return res.json(result);
    }

  }

  return res.json({message : 'Something went wrong with add food'})
}

export const GetFoods = async(req : Request,res : Response,next : NextFunction) => {

  const {user} = req;
  
  const foods = await Food.find({vendorId : user?._id})

  if(foods !== null){
    return res.status(200).json({
      message : 'all foods fetched successfully with given vendor id',
      success : true,
      foods
    })
  }

}

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {

  const user = req.user;
  
  if(user){

      const orders = await Order.find({ vendorId: user._id}).populate('items.food');

      if(orders != null){
          return res.status(200).json(orders);
      }
  }

  return res.json({ message: 'Orders Not found'});
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {

  const orderId = req.params.id;
  
  if(orderId){

      const order = await Order.findById(orderId).populate('items.food');

      if(order != null){
          return res.status(200).json(order);
      }
  }

  return res.json({ message: 'Order Not found'});
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {

  const orderId = req.params.id;

  const { status, remarks, time } = req.body;

  
  if(orderId){

      const order = await Order.findById(orderId).populate('items.food');

      if(order !== null){
      order.orderStatus = status
      order.remarks = remarks;
      if(time){
          order.readyTime = time;
      }

      const orderResult = await order.save();

      if(orderResult != null){
          return res.status(200).json(orderResult);
      }
  }
}

  return res.json({ message: 'Unable to process order'});
}