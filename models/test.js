const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const testSchema = new Schema(
  {
    package_type: {
      type: String,
      default: null,
      enum: ["lab-test", "health-package"],
      trim: true,
    },
    package_image:{
      type:String,
      default:null,
      trim:true, 
    },
    package_image_altTag:{
      type:String,
      default:null, 
    },
    specialityName: {
      type: String,
      default: null,
      trim: true,
    },
    cat_id: {
      type: ObjectId,
      default: null,
    },
    code: {
      type: Number,
      default: null,
    },
    test_name: {
      type: String,
      default: null,
      trim: true,
    },
    test_pre_test_info: {
      type: String,
      default: null,
      trim: true,
    },
    report: {
      type: String,
      default: null,
      trim: true,
    },
    test_url: {
      type: String,
      default: null,
      trim: true,
    },
    mrp: {
      type: Number,
      default: null,
    },
    offer_price: {
      type: Number,
      default: null,
    },
    no_of_parameters: {
      type: Number,
      default: null,
    },
    test_components: {
      type: String,
      default: null,
      trim: true,
    },
    meta_title: {
      type: String,
      default: null,
      trim: true,
    },
    meta_desc: {
      type: String,
      default: null,
      trim: true,
    },
    meta_keyword: {
      type: String,
      default: null,
      trim: true,
    },
    search_tag: {
      type: String,
      default: null,
      trim: true,
    },
    also_known_as: {
      type: String,
      default: null,
      trim: true,
    },
    test_type: {
      type: String,
      default: null,
      trim: true,
    },
    department: {
      type: String,
      default: null,
      trim: true,
    },
    preparation: {
      type: String,
      default: null,
      trim: true,
    },
    reporting: {
      type: String,
      default: null,
      trim: true,
    },
    test_price_info: {
      type: String,
      default: null,
      trim: true,
    },
    related_tests: {
      type: String,
      default: null,
      trim: true,
    },
    by_habits: {
      type: ObjectId,
      default: null,
    },
    by_healthRisk: {
      type: ObjectId,
      default: null,
    },
    test_status: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: null,
      trim: true,
    },

    collection_type:{
      type:String,
      default : null,
      enum:["home collection","centre visit"],
    },
    number_of_star:{
      type:Number,
      enum:[1,2,3,4,5],
      default:5,
    },
    number_of_review:{
      type:Number,
      default:null
    },
    featured_test:{
      type:Boolean,
      default:false
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("test", testSchema);
