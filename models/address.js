const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const addressSchema = new Schema(
  {
    userId: {
      type: ObjectId,
    },
    // fullName: {
    //   type: String,
    //   trim: true,
    //   default: null,
    // },
    address1: {
      type: String,
      trim: true,
      default: null,
    },
    near_by_locality: {
      type: String,
      trim: true,
      default: null,
    },
    date_add: {
      type: Date,
      default: null,
    },
    time: {
      type: String,
      default: null,
    },
    address_type: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    state: {
      type: String,
      trim: true,
      default: null,
    },
    postCode: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("address", addressSchema);
