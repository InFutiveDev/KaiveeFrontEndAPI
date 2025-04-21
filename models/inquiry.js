const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const inquirySchema = new Schema(
  {
    
    patient_name: {
      type: String,
      default: null,
      trim: true,
    },
    patient_email: {
      type: String,
      default: null,
      trim: true,
    },
    // testId:{
    //   type:ObjectId,
    //   default:null
    // },
    
    message: {
      type: String,
      default: null,
      trim: true,
    },
    // contact_status: {
    //   type: Boolean,
    //   default: false,
    // },
    mobile_number: {
      type: Number,
      default: null,
      trim:true,
    },
    otp:{
      type:Number,
      default:null,
      trim:true,
    },
    inquiry_from:{
      type:String,
      default:null,
    },
    url:{
      type:String,
      default:null,
    },
    testfield:{
      type:ObjectId,
      default:null,
    },
    appointment_date:{
      type:String,
      default:null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("inquiry", inquirySchema);
