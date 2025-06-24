const User = require('../models/userSchema'); 

const addUser = async (req, res) => {
  const { tzkid, firstName, gender } = req.body; 

  if (!tzkid || !firstName|| !gender) {
    return res.status(400).json({ message: 'tzkid, username, and gender are required.' });
  }

  try {
    
    const newUser = new User({
      tzkid,
      email: `${firstName}@example.com`, 
      firstName: firstName,
      lastName: '', 
      gender,

    });

    await newUser.save();

    return res.status(201).json({
      message: 'User added successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error adding user:', error);
    return res.status(500).json({ message: 'Server error while adding user.' });
  }
};

module.exports = { addUser };
