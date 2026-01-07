import mongoose from "mongoose";

const productSchema=mongoose.Schema({
    name:String,
    description:String,
    price:Number,
    filename:String
})

export const productModel=mongoose.model('Product',productSchema)