const Student = require("../models/studentSchema");
const Room = require("../models/roomSchema");
const User = require("../models/userSchema");
const ExcelJS = require("exceljs");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");



const getStudentDetails = async (req, res) => {
  console.log("Get student details route triggered"); 
  const { teckziteId } = req.params;
  try {
    const student = await Student.findOne({
      teckziteId: new RegExp(`^${teckziteId}$`, "i"),
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json({ user: student });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



const recentCheckIns = async (req, res) => {
  try {
    const { limit = 5 } = req.query; 
    const recentCheckIns = await Student.find().sort({ checkInTime: -1 }) .limit(parseInt(limit));
    if (recentCheckIns.length === 0) {
      return res.status(404).json({ message: "No recent check-ins found" });
    }

    res.status(200).json(recentCheckIns);
  } catch (error) {
    console.error("Error fetching recent check-ins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const allocateRoom = async (req, res) => {
  const { tzkid, action, gender, roomNumber } = req.body;

  try {
    const user = await User.findOne({ tzkid: new RegExp(`^${tzkid}$`, "i") });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.email.endsWith("@rguktn.ac.in")) {
      return res.status(400).json({ message: "Room allocation not possible." });
    }

    if (action === "checkin") {
      const studentRecord = await Student.findOne({ teckziteId: tzkid });

      if (studentRecord?.hasCheckedOut) {
        return res.status(400).json({ message: "Reallocation is not allowed after checkout." });
      }

      const existingAllocation = await Room.findOne({ "occupants.studentId": user._id });

      if (!user.gender || user.gender.toLowerCase() !== gender.toLowerCase()) {
        return res.status(400).json({ message: `Gender mismatch. User gender: ${user.gender}` });
      }

      if (existingAllocation) {
        const existingBed = existingAllocation.occupants.find(occ => occ.studentId?.toString() === user._id.toString());
        return res.status(200).json({
          message: "Student is already allocated.",
          allocation: {
            hostel: existingAllocation.hostel,
            room: existingAllocation.roomNumber,
            bed: existingBed?.bed,
            gmail: user.email,
          },
        });
      }

      const hostel = gender.toLowerCase() === "male" ? "I3-B" : "I3-G";
      let availableRoom = roomNumber
        ? await Room.findOne({ roomNumber, hostel })
        : await Room.findOne({ hostel, "occupants.studentId": { $exists: true, $size: { $lt: 6 } } });

      if (!availableRoom) {
        return res.status(404).json({ message: `No available rooms in ${hostel} hostel.` });
      }

      // 🚨 Fix Over-Allocation 🚨
      if (availableRoom.occupants.filter(o => o.studentId !== null).length >= 6) {
        return res.status(400).json({ message: `Room ${availableRoom.roomNumber} is already full.` });
      }

      // 🔹 Assign the first available bed correctly 🔹
      const occupiedBeds = availableRoom.occupants.filter(o => o.studentId !== null).map(o => o.bed);
      const availableBeds = [1, 2, 3, 4, 5, 6].filter(b => !occupiedBeds.includes(b));

      if (availableBeds.length === 0) {
        return res.status(400).json({ message: `No available beds in room ${availableRoom.roomNumber}.` });
      }

      const bed = availableBeds[0];

      availableRoom.occupants.push({ studentId: user._id, bed });
      await availableRoom.save();

      const address = `${user.state}, ${user.district}, ${user.city}`;

      await Student.findOneAndUpdate(
        { teckziteId: tzkid },
        {
          teckziteId: tzkid,
          name: user.firstName,
          gender: gender.toLowerCase(),
          hostel,
          room: availableRoom.roomNumber,
          bed,
          gmail: user.email,
          checkInTime: new Date(),
          hasCheckedOut: false,
          phno: user.phno,
          state: user.state,
          district: user.district,
          city: user.city,
          address,
        },
        { upsert: true, new: true }
      );

      return res.status(201).json({
        message: "Room allocated successfully.",
        allocation: {
          hostel: availableRoom.hostel,
          room: availableRoom.roomNumber,
          bed,
          gmail: user.email,
          phno: user.phno,
          state: user.state,
          district: user.district,
          city: user.city,
          address,
        },
      });
    } else if (action === "checkout") {
      const student = await Student.findOne({ teckziteId: tzkid });

      if (!student?.room || !student?.bed) {
        return res.status(404).json({ message: "User not checked in yet." });
      }

      const room = await Room.findOne({ "occupants.studentId": user._id });
      if (!room) return res.status(404).json({ message: "Room allocation not found." });

      // Remove the student from the room's occupants list
      room.occupants = room.occupants.filter(occupant => occupant.studentId?.toString() !== user._id.toString());
      await room.save();

      // Update student checkout history and status
      await Student.findOneAndUpdate(
        { teckziteId: tzkid },
        {
          $push: {
            checkoutHistory: {
              room: student.room,
              bed: student.bed,
              checkInTime: student.checkInTime,
              checkOutTime: new Date(),
              state: student.state,
              district: student.district,
              city: student.city,
            },
          },
          hostel: null,
          room: null,
          bed: null,
          checkOutTime: new Date(),
          hasCheckedOut: true,
        }
      );

      return res.status(200).json({ message: "User successfully checked out." });
    } else {
      return res.status(400).json({ message: "Invalid action." });
    }
  } catch (error) {
    console.error("Error during room allocation:", error);
    return res.status(500).json({ message: "Server error." });
  }
};









const exportToExcelByGender = async (req, res) => {
  try {
    const { gender } = req.params;

    if (!["male", "female"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender parameter." });
    }

    const students = await Student.find({ gender });

    if (students.length === 0) {
      return res.status(404).json({ message: `No students found for ${gender}.` });
    }

    const formattedStudents = students.map((s) => {
      const lastCheckout = s.checkoutHistory?.length ? s.checkoutHistory[s.checkoutHistory.length - 1] : null;

      return {
        TZKID: s.teckziteId,
        Name: s.name,
        Email: s.gmail,
        Gender: s.gender,
        Room_No: s.room || lastCheckout?.room || "NA",
        Bed_No: s.bed || lastCheckout?.bed || "NA",
        Phone_No:s.phno,
        State: s.state || lastCheckout?.state || "NA", 
        District: s.district || lastCheckout?.district || "NA", 
        City: s.city || lastCheckout?.city || "NA", 
        checkInTime: s.checkInTime
          ? new Date(s.checkInTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          : lastCheckout?.checkInTime
          ? new Date(lastCheckout.checkInTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          : "NA",
        checkOutTime: s.hasCheckedOut
          ? s.checkOutTime
            ? new Date(s.checkOutTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
            : lastCheckout?.checkOutTime
            ? new Date(lastCheckout.checkOutTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
            : "NA"
          : "NA",
      };
    });


    const ws = XLSX.utils.json_to_sheet(formattedStudents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

 
    ws["!cols"] = Array(Object.keys(formattedStudents[0]).length).fill({ width:25 });

    const filePath = path.join(__dirname, "../exports", `${gender}_Checkin_Data.xlsx`);
    XLSX.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const exportCheckoutDataToExcel = async (req, res) => {
  const { gender } = req.params;

  try {
    if (!gender) {
      return res.status(400).json({ message: "Gender parameter is missing." });
    }
    const students = await Student.find({ gender, hasCheckedOut: true });

    if (!students.length) {
      return res
        .status(404)
        .json({ message: "No checkout data found for this gender." });
    }

    const exportDir = path.join(__dirname, "../exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Checkout Data");

    worksheet.columns = [
      { header: "TZKID", key: "tzkid", width: 20 },
      { header: "Name", key: "name", width: 30 },
      { header: "RoomNo", key: "Room_No", width: 20 },
      { header: "BedNo", key: "Bed_No", width: 20 },
      { header: "PhoneNo", key: "phno", width: 25 },
      { header: "State", key: "state", width: 25 },
      { header: "District", key: "district", width: 25 },
      { header: "City", key: "city", width: 30 },
      { header: "Check-In Date", key: "checkInTime", width: 25 },
      { header: "Check-out Date", key: "checkOutTime", width: 25 },
    ];

    students.forEach((student) => {
      const lastCheckout = student.checkoutHistory?.length
        ? student.checkoutHistory[student.checkoutHistory.length - 1]
        : null;

      worksheet.addRow({
        tzkid: student.teckziteId,
        name: student.name,
        Room_No: student.room || (lastCheckout ? lastCheckout.room : "NA"),
        Bed_No: student.bed || (lastCheckout ? lastCheckout.bed : "NA"),
        phno:student.phno,
        state: student.state || (lastCheckout? lastCheckout.state : "NA"),
        district: student.district || (lastCheckout? lastCheckout.district : "NA"), 
        city: student.city || (lastCheckout ? lastCheckout.city : "NA"), 
        checkInTime: student.checkInTime
          ? new Date(student.checkInTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
          : lastCheckout?.checkInTime
          ? new Date(lastCheckout.checkInTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
          : "NA",
        checkOutTime: student.checkOutTime
          ? new Date(student.checkOutTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
          : "NA",
      });
    });

    const fileName = `${gender}_checkout_data.xlsx`;
    const filePath = path.join(exportDir, fileName);
    await workbook.xlsx.writeFile(filePath);

    console.log(`Excel file saved to: ${filePath}`);

    res.download(filePath);
  } catch (error) {
    console.error("Error exporting checkout data:", error);
    res.status(500).json({ message: "Failed to export data" });
  }
};





module.exports = {
  allocateRoom,
  getStudentDetails,
  recentCheckIns,
  exportToExcelByGender,
  exportCheckoutDataToExcel,
 
};
