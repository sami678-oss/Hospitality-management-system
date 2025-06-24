const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  hostel: { type: String, required: true, enum: ['I3-B', 'I3-G'] },
  occupants: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, 
      bed: { type: Number, required: true },
    },
  ],
  totalBeds: { type: Number, default: 6 }, 
  availableBeds: [
    { type: Number }, 
  ],
});
const Room=mongoose.model('Room', roomSchema);

module.exports = Room;



/*
type: mongoose.Schema.Types.ObjectId
This tells Mongoose to expect a MongoDB ObjectId here.

ObjectId is a unique identifier for each document in a MongoDB collection (e.g., each student).

Looks like: "660e5a73cbb3f33b5af8b10f"

It’s basically a foreign key in MongoDB.

Why use ObjectId here?

Because you want to reference another document — specifically, a document in the Student collection.

*/
