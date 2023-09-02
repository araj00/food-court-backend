import mongoose, { Schema, Document, Model } from "mongoose";

interface VendorDoc extends Document {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    phone: string;
    email: string;
    address: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImages: [string];
    rating: number;
    foods: any
}

const VendorSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerName: { type: String, required: true },
        foodType: { type: [String] },
        pincode: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String },
        password: { type: String, required: true },
        salt: { type: String, required: true },
        serviceAvailable: { type: Boolean },
        foods: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }],
        rating: {
            type: Number
        },
        coverImages: {
            type: [String]
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.salt;
                delete ret._v;
                delete ret.createdAt;
                delete ret.updatedAt
            }
        },
        timestamps: true
    }

)

const Vendor = mongoose.model<VendorDoc>('Vendor', VendorSchema)

export { Vendor }