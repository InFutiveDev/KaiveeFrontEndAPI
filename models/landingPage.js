const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const landingPageSchema = new Schema({

    name:{
        type:String,
        default:null,
    },
    title:{
        type:String,
        default:null,
    },
    // bannerimage:{
    //     type:String,
    //     default:null,
    //     trim:true
    // },
    landingPageSource:{
        type:String,
        default:null,
        trim:true
    },
    bannerContant:{
        type:String,
        default:null,

    },
    landingPageArticle:{
        type:String,
        default:null

    },
    testArticle:{
        type:String,
        default:null
    },
    metaTagTitle:{
        type:String,
        default:null,
    },
    metaTagDescription:{
        type:String,
        default:null
    },
    metaTagKeywords:{
        type:String,
        default:null,
        trim:true
    },
    phone:{
        type:Number,
        default:null,
        trim:true,
    },
    
    url:{
        type:String,
        default:null,
        trim:true,

    },
    landingpageimage:{
        type:String,
        default:null,
        trim:true,
    },
   
    landingPageStatus:{
        type:String,
        enum :['Active','Inactive'],
        default : 'Inactive'
    },
    addTest:[
      {
        type:ObjectId,
        default:null
      }
    ],
    testDescription:{
        type:String,
        default:null
    },
},
{
    timestamps:true,
}
);
module.exports = mongoose.model("landingPage",landingPageSchema);