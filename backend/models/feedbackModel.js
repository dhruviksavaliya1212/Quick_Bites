import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    feedbackMessage:{
        type:String,
        required:true
    },
    isRegisteredUser:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

export const Feedback = mongoose.model('Feedback',feedbackSchema)
