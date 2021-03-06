const { claimTypeArray, performanceArray } = require("./../utils/enum-configs");

const { Schema, model } = require("mongoose");

const claimSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true
    },
    debtor: {
      type: String,
      required: true,
      trim: true
    },
    debtorLocation: {
      type: String,
      required: true
      // eventually add country enum but we'll try to solve via HTML 
    },
    faceValue: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      // eventually remove and check via HTML form
      // enum: ['EUR', 'USD', 'GBP'],
      required: true
    },
    claimType: {
      type: String,
      enum: claimTypeArray,
      required: true
    },
    minimumPrice: {
      type: Number,
      min: 0,
      max: 100
    },
    performance: {
      type: String,
      enum: performanceArray
    },
    maturity: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Claim = model("Claim", claimSchema);

module.exports = Claim;

