import mongoose,{Schema,Document} from "mongoose";

export interface OrderDoc extends Document{

    orderId : string,
    items : [any],
    totalAmount : number,
    orderDate :Date,
    paidThrough : string,
    paymentResponse : string,
    orderStatus : string
    
}

const OrderSchema = new Schema(
    {
        orderId : {
            type : String,
            required : true
        },
        items : [
            {
            food : {

                type : mongoose.Schema.Types.ObjectId,
                ref : 'Food',
                required : true
            },
            units : {
                type : Number,
                required : true
            }
            }
        ],
        totalAmount : Number,
        orderDate : Date,
        paidThrough : String,
        paymentResponse : String,
        orderStatus : String
    },{
        toJSON:{
            transform(doc,ret){
             delete ret._v,
             delete ret.createdAt,
             delete ret.updatedAt
            }
        },
        timestamps: true
    }
)

const Order = mongoose.model<OrderDoc>('Order',OrderSchema)

export {Order}