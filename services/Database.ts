import mongoose from "mongoose";

const MONGODB_URL = 'mongodb://0.0.0.0:27017/online-delivery-food'
export const APP_SECRET = 'Our_App_Secret';

const dbConnect = async() => {
    try{
      console.log('connection to db is initiated')
      await mongoose.connect(MONGODB_URL)
    }
    catch(err){
        console.log(err)
    }
}
 
mongoose.connection.on('connected',() => {
    console.log('connected to db successfully')
})

mongoose.connection.on('error',(err) => {
    console.log(err)
})

mongoose.connection.on('disconnected',() => {
    console.log('connection to db is terminated')
})

process.on('SIGINT',async() => {
    await mongoose.connection.close()
    process.exit(0)
})

export {dbConnect}