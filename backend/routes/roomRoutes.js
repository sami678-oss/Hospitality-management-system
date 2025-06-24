const express = require('express');
const { getRoomDetails, getHostelStats} = require('../controllers/roomController');
const router = express.Router();

router.get('/room/:roomNumber', getRoomDetails);
router.get('/hostel-stats', getHostelStats);





module.exports = router;
