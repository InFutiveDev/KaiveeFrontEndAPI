const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;
let AutoIncrement = require('mongoose-sequence')(mongoose);

const bookingSchema = new Schema(
  {
    memberId: {
      type: ObjectId,
      default: null,
    },
    userId: {
      type: ObjectId,
      default: null,
    },
    address: {
      type: ObjectId,
      default: null,
    },
    sampleCollectionDateTime: {
      type: Date,
      default: null,
    },
    timeslot:{
      type:String,
      default:null,
    },
    testId: [
      {
        package_type: {
          type: String,
          default: null,
          enum: ["lab-test", "health-package"],
          trim: true,
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
        by_habits: [{
          _id: { type: Schema.Types.ObjectId, ref: 'Habit' },
          hebitName: { type: String }
        }
      ],
        by_healthRisk: [{
          _id: { type: Schema.Types.ObjectId, ref: 'HealthRisk' },
          healthRiskTitle: { type: String }
        },
      ],
        test_status: {
          type: Boolean,
          default: false,
        },
        position: {
          type: String,
          default: null,
          trim: true,
        },
      },
    ],
    collectionType: {
      type: String,
      trim: true,
      default: null,
    },
    couponId: {
      type: ObjectId,
      default: null,
    },
    lab_id: {
      type: ObjectId,
      default: null,
    },
    labAddress: {
      type: String,
      trim: true,
      default: null,
    },
    paymentAmount: {
      type: Number,
      default: null,
    },
    is_paid: {
      type: Boolean,
      default: false
    },
    paymentType: {
      type: String,
      enum: ["cod", "online"],
    },
    payment_gateway_response: {
      type: String,
      default: null,
    },
    paymentJsonPayloadReq: {
      type: String,
      default: null,
    },
    paymentjwtEncryptRequest: {
      type: String,
      default: null,
    },
    paymentjwtDecryptRequest: {
      type: String,
      default: null,
    },
    paymentJsonResponse: {
      type: String,
      default: null,
    },
    payment_gateway_link_id: {
      type: String,
      default: null,
    },
    payment_gateway_link: {
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);
bookingSchema.plugin(AutoIncrement, { inc_field: 'id', id: "bookingId" });
module.exports = mongoose.model("booking", bookingSchema);
