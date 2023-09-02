import {Request,Response,NextFunction} from 'express'
import { CreateVendorInput } from '../dto'
import { Vendor } from '../models'
import { GeneratePassword, GenerateSalt} from '../utility'

export const FindVendor = async(id : string|undefined , email?: string|undefined) => {
  if(email){
    return await Vendor.findOne({email : email})
  }

  else{
    return await Vendor.findById(id)
  }
}

export const CreateVendor = async(req : Request,res : Response,next : NextFunction) => {
    
    const {name,
          address,
          pincode,
          foodType,
          email,
          password,
          ownerName,
          phone} = <CreateVendorInput>req.body


    const existingVendor  =  await FindVendor('',email);

    if(existingVendor !== null){
      return res.json({
        message : 'A vendor is already existed with this mail id'
      })
    }

    const salt = await GenerateSalt()

    const userPassword = await GeneratePassword(password,salt)

    const createVendor = await Vendor.create(
        {
          name,
          address,
          pincode,
          foodType,
          email,
          password : userPassword,
          ownerName,
          phone,
          salt,
          serviceAvailable : false,
          coverImages : []
        }
    )

    return res.json(createVendor)
}
export const GetVendors = async(req : Request,res : Response,next : NextFunction) => {

  const vendors = await Vendor.find()

  if(vendors !== null){
    return res.json(vendors)
  }

  return res.json({message : 'vendors data not available'})
  
    
}
export const GetVendorById = async(req : Request,res : Response,next : NextFunction) => {
    
  const {id} = req.params;
  const vendor = await FindVendor(id)

  if(vendor!==null){
    return res.status(200).json(
      {
        vendor
      }
    )
  }

  return res.json({message : 'vendors data not available'})


}

