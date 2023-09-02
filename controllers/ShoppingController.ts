import {Request,Response,NextFunction} from 'express'
import { FoodDoc, Vendor } from '../models';

export const GetFoodAvailability = async(req : Request,res : Response,next : NextFunction) => {

    const {pincode} = req.params;

    const result = await Vendor.find({pincode : pincode,serviceAvailable : false})
                               .sort([['rating' , -1 ]])
                               .populate('foods')


    if(result.length>0){
        return res.status(200).json({
            message : 'successfully fetched all available foods',
            success : true,
            data : result
        })
    }

    res.status(404).json({
        message : 'no data found',
        success : false
    })

}

export const GetTopRestaurants = async(req : Request,res : Response,next : NextFunction) => {
    
    const {pincode} = req.params;

    const result = await Vendor.find({pincode : pincode,serviceAvailable : false})
                               .sort([['rating' , -1 ]])
                               .limit(1)

    if(result.length>0){
        return res.status(200).json({
            message : 'successfully fetched all top restaurants',
            success : true,
            data : result
        })
    }

    res.status(404).json({
        message : 'no data found',
        success : false
    })

}
export const GetFoodsIn30Min = async(req : Request,res : Response,next : NextFunction) => {

    const {pincode} = req.params

    const result = await Vendor.find({pincode:pincode,serviceAvailable:false}).sort([['rating',-1]]).populate('foods');

    if(result.length>0){
        console.log(result)
        let foodResult : any=[]

        result.map( vendor => {
            const foods = vendor.foods as [FoodDoc]

            foodResult.push(...foods.filter(food => food.readyTime <= 30 )) 
        })
        return res.status(200).json({
            message : 'fetched all foods to be delivered within 30 min',
            success : true,
            data : foodResult
        })
    }

    return res.status(404).json({
        message : 'no data available',
        sucess: false
    })
    
}
export const SearchFoods = async(req : Request,res : Response,next : NextFunction) => {
    const {pincode} = req.params;

    const result = await Vendor.find({pincode : pincode,serviceAvailable : false})
                               .populate('foods')

    if(result.length>0){
        let foodResult : any = [];
        result.map(item => foodResult.push(...item.foods))
        return res.status(200).json({
            message : 'successfully fetched all the foods with search term',
            success : true,
            data : foodResult
        })
    }

    res.status(404).json({
        message : 'no data found',
        success : false
    })
}
export const RestaurantById = async(req : Request,res : Response,next : NextFunction) => {
    const {id} = req.params;

    const result = await Vendor.findById(id)
                               .populate('foods')

    if(result){
        return res.status(200).json({
            message : 'successfully fetched restaurant with id',
            success : true,
            data : result
        })
    }

    res.status(404).json({
        message : 'no data found',
        success : false
    })
}