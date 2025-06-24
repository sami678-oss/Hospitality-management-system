const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    tzkid: String,
    email: { type: String, required: true, unique: true },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    college: String,
    phno: { type: String, length: 10 },
    year: String,
    branch: String,
    collegeId: String,
    amountPaid: String,
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    referredBy: String,
    img: String,
    state: String,
    district: String,
    city: String,
    sub: { type: String, unique: true },
    idUpload: String,
    qrimage: String,
    refreals: {
      type: [{ type: String }],
      default: [],
    },
    regEvents: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
      default: [],
    },
    regWorkshop: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }],
      default: [],
    },
    razorpay_order_id: String,
    mode: String,
    credits: { type: Number, default: 200 },
  },

  {
    timestamps: true,
  }
);



const User = mongoose.model("User", UserSchema);
module.exports = User;
