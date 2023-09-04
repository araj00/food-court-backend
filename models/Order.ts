import mongoose,{Schema,Document} from "mongoose";

export interface OrderDoc extends Document{

    orderId : string,
    vendorId: string,
    items : [any],
    totalAmount : number,
    orderDate :Date,
    paidThrough : string,
    paymentResponse : string,
    orderStatus : string
    remarks: string;
    readyTime: number;
}

const OrderSchema = new Schema(
    {
        orderId : {
            type : String,
            required : true
        },
        vendorId : {
            type: String,
            required: true
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
        orderStatus : String,
        readyTime:{type: Number},
        remarks:{type: String},
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