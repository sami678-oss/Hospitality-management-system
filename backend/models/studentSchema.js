const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  teckziteId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gmail:{type:String,unique:true},
  gender: { type: String, required: true, enum: ['male', 'female'] },
  hostel: { type: String, enum: ['I3-B', 'I3-G'] },
  room: { type: String },
  bed: { type: Number },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  hasCheckedOut: { type: Boolean, default: false }, 
  phno: { type: String, length: 10 },
  state: {type:String},
  district: {type:String},
  city: {type:String},
  address: {type:String},
  checkoutHistory: [
    {
      room: String,
      bed: Number,
      checkInTime: Date,
      checkOutTime: Date,
      state: String,
      district: String,
      city: String,
    },
  ],
});

const Student=mongoose.model('Student', studentSchema);
module.exports = Student;
