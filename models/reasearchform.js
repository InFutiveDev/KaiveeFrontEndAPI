const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reasearchForm = new Schema(
  {
    your_name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    mobile_number: {
      type: String,
      default: null,
    },
    write_up: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("reasearchForm", reasearchForm);
