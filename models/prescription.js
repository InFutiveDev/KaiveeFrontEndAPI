
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;
let AutoIncrement = require('mongoose-sequence')(mongoose);

const prescriptionSchema = new Schema({
    userid:{
        type:ObjectId,
        default:null,
    },
    patient_name:{
        type:String,
        default:null,
        
    },
    dob:{
        type:String,
        default:null,

    },
    age:{
        type:Number,
        default:null,
        trim:true,
    },
    gender:{
        type:String,
        default:null,
    },
    add_prescription:[{
        type:String,
        default:null,
        trim:true,
    }],
    user_mobile:{
        type:Number,
        default:null,
        trim:true,
    },
    caseId:{
        type:Number,
        default:null,
        trim:true,
    },
},
{
    timestamps:true,
})
prescriptionSchema.plugin(AutoIncrement, { inc_field: 'caseId', id: "case_number_Id" });
module.exports = mongoose.model("prescription",prescriptionSchema);

