const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    your_phone:{
        type:Number,
        default:null,

    },
    caseCode:{
        type:Number,
        default:null,

    },
    your_name:{
        type:String,
        default:null,

    },
    your_email:{
        type:String,
        default:null,
        trim:true,
    },
    gender:{
        type:String,
        default:null,
    },
    suggestion:{
        type:String,
        default:null,
    },
    otp:{
        type:Number,
        default:null
    },
},
{
    timestamps:true,
})

module.exports = mongoose.model("feedback", feedbackSchema);