const express = require("express");
const {
  allocateRoom,
  recentCheckIns,
  exportToExcelByGender,
  exportCheckoutDataToExcel,
  getStudentDetails,
 
} = require("../controllers/studentController");

const router = express.Router();

router.post("/allocate", allocateRoom);

router.get("/recent-checkins", recentCheckIns);

router.get("/export-excel/:gender", exportToExcelByGender); // New route

router.get("/exports-excel/:gender", exportCheckoutDataToExcel);

router.get("/:teckziteId", getStudentDetails);



module.exports = router;
