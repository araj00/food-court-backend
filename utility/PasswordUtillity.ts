import bcrypt from 'bcrypt'
import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { VendorPayload } from '../dto'
import { APP_SECRET } from '../config'
import { AuthPayload } from '../dto/Auth.dto'

export const GenerateSalt = async() => {
    return await bcrypt.genSalt()
}

export const GeneratePassword = async(password : string,salt : string) => {
    return await bcrypt.hash(password,salt)
}

export const ValidatePassword = async(enteredPassword : string,savedPassword : any) => {
   const match = await bcrypt.compare(enteredPassword,savedPassword)
   return match
}

export const GenerateSignature = (payload : AuthPayload) => {
    const signature = jwt.sign(payload,APP_SECRET,{expiresIn : '1d'}) 
    return signature

}

export const ValidateSignature = async(req: Request) => {

    const signature = req.get('Authorization');

    if(signature){
        const payload =  jwt.verify(signature.split(' ')[1],APP_SECRET) as AuthPayload;

        req.user = payload;

        return true;
    }
    return false
}