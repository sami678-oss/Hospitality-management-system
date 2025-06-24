const express = require('express');
const { addUser } = require('../controllers/userController'); // Import the controller function
const router = express.Router();

// Route to add user with minimal data
router.post('/add', addUser);

module.exports = router;
