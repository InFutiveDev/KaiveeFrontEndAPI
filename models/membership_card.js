const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const membershipCardSchema = new Schema({
    cardMember_name:{
        type:String,
        default:null,
    },
    cardMember_email:{
        type:String,
        default:null,
    },
    cardMember_mobile:{
        type:Number,
        default:null,
        trim:true,
    },
    cardMember_test:{
        type:ObjectId,
        default:null,
    },
    cardMember_status:{
        type:Boolean,
        default:false,

    },
},
{
    timestamps:true,
});


module.exports = mongoose.model("membershipCard",membershipCardSchema);