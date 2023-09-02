export interface CreateVendorInput{
    name : string;
    ownerName : string;
    foodType : [string];
    pincode : string;
    phone : string;
    email : string;
    address : string;
    password : string
}

export interface VendorLoginInput{
    email : string;
    password : string
}

export interface EditVandorInput{
    name : string;
    phone:string;
    address : string;
    foodType : [string]
}

export interface VendorPayload{
    _id : string;
    email : string;
    name : string;
    foodTypes : [string]
}