const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const couponSchema = new Schema(
  {
    coupon_code: {
      type: String,
      default: null,
      trim: true,
    },
    used_type: {
      type: String,
      default: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    max_value: {
      type: Number,
      default: null,
    },
    discount_type: {
      type: String,
      default: null,
      trim: true,
    },
    validity: {
      type: Date,
      default: null,
    },
    minimum_amount: {
      type: Number,
      default: null,
    },
    valid_all_test: {
      type: Boolean,
      default: null,
    },
    selected_test: {
      type: Boolean,
      default: null,
    },
    addTest: {
      type: ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("coupon", couponSchema);