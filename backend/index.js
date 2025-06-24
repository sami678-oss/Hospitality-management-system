const dotenv=require('dotenv')
const express = require('express');
const roomRoutes = require('./routes/roomRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes'); 
const bodyParser= require('body-parser');
const cors=require('cors');
const mongoose = require('mongoose');

const Student=require('./models/studentSchema')


const app = express();

dotenv.config()
app.use(express.json());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: "true" }));
app.use(cors("*"));
app.use(express.json());


app.use('/api/rooms', roomRoutes);
app.use('/api/students', studentRoutes);


app.use('/api/users', userRoutes);


app.get('/api/total-arrivals', async (req, res) => {
  try {
    const totalArrivals = await Student.countDocuments({});

    res.status(200).json({ totalArrivals });
  } catch (error) {
    console.error("Error fetching total arrivals:", error);
    res.status(500).json({ message: "Server error." });
  }
});


app.get('/api/total-left', async (req, res) => {
  try {
   
    const totalLeft = await Student.countDocuments({ checkOutTime: { $ne: null } });

    res.status(200).json({ totalLeft });
  } catch (error) {
    console.error("Error fetching total left students:", error);
    res.status(500).json({ message: "Server error." });
  }
});




mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port 4001 🔥`);
      console.log("Database Connected Successfully ");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
