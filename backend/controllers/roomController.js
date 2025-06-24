const Room = require('../models/roomSchema');

const getRoomDetails = async (req, res) => {
  const { roomNumber } = req.params;
  try {
    const room = await Room.findOne({ roomNumber })
      .populate('occupants.studentId', 'firstName teckziteId gender');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    return res.status(200).json(room);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};




const getHostelStats = async (req, res) => {
  try {
    const boysHostelRooms = await Room.find({ hostel: 'I3-B' }).populate('occupants.studentId', 'firstName teckziteId gender');
    const girlsHostelRooms = await Room.find({ hostel: 'I3-G' }).populate('occupants.studentId', 'firstName teckziteId gender');

    const calculateStats = (rooms) => ({
      totalRooms: rooms.length,
      filledRooms: rooms.filter(room => room.occupants.length === 6).length,
      totalStudents: rooms.reduce((sum, room) => sum + room.occupants.length, 0),
      roomDetails: rooms.map(room => ({
        roomNumber: room.roomNumber,
        totalBeds: 6,
        occupiedBeds: room.occupants.length,
        availableBeds: 6 - room.occupants.length, // Ensures it never goes negative
        occupants: room.occupants.map(occ => ({
          studentId: occ.studentId?._id,
          name: occ.studentId?.firstName || "N/A",
          teckziteId: occ.studentId?.teckziteId || "N/A",
          gender: occ.studentId?.gender || "N/A",
          bedNumber: occ.bed,
        })),
        hostel: room.hostel,
      })),
    });

    return res.status(200).json({
      boy: calculateStats(boysHostelRooms),
      girl: calculateStats(girlsHostelRooms),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRoomDetails,
  getHostelStats,
};
