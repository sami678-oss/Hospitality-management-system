import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Checkin = ({ setDashboardStats }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roomNumberFromURL = params.get("roomNumber"); 
  const [roomNumber, setRoomNumber] = useState(roomNumberFromURL);  
  const [tzkid, setTzkid] = useState("");
  const [gender, setGender] = useState("");
  const [allocation, setAllocation] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (roomNumberFromURL) {
      console.log("Pre-selected room number:", roomNumberFromURL);
    }
  }, [roomNumberFromURL]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancelRoomSelection = () => {
    // Reset room number to null
    setRoomNumber(null);
    setAllocation(null);  // Clear previous allocation details
    showToast("Room selection cancelled. ", "info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^TZK25/i.test(tzkid)) {
      showToast("Invalid tzkid. It must start with 'TZK25'.", "error");
      return;
    }

    if (!gender) {
      showToast("Please select a gender.", "error");
      return;
    }

    const allocationRequest = roomNumber
      ? { tzkid, gender, action: "checkin", roomNumber }
      : { tzkid, gender, action: "checkin" }; 

    try {
      const response = await fetch("https://hospitality-management-system-nljq.onrender.com/api/students/allocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allocationRequest),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message || "Room allocated successfully!", "success");
        setAllocation(data.allocation);

        setDashboardStats({
          teckId: tzkid,
          guestName: data.student?.guestName || "N/A",
          gender,
          checkInDate: new Date().toISOString().split("T")[0],
        });
      } else {
        showToast(data.message || "Error during allocation process.", "error");
      }
    } catch (error) {
      console.error("Error during check-in process:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-lg bg-gray-800 bg-opacity-50 p-8 shadow-lg backdrop-blur-lg"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-white">Check-In</h2>

        {roomNumber && (
          <div className="flex items-center justify-between">
            <h2 className="text-center text-blue-400">Room Selected  : {roomNumber}</h2>
            <button
              onClick={handleCancelRoomSelection}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              cancel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Enter TZKID"
              value={tzkid}
              onChange={(e) => setTzkid(e.target.value)}
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-center space-x-4">
            {["male", "female"].map((option) => (
              <motion.button
                key={option}
                type="button"
                onClick={() => setGender(option)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-md px-4 py-2 font-medium transition-colors ${
                  gender === option
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </motion.button>
            ))}
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Allocate Room
          </motion.button>
        </form>

        {allocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 rounded-md bg-gray-700 bg-opacity-50 p-4"
          >
            <h3 className="mb-2 text-xl font-semibold text-white">Allocation Details</h3>
            <p className="text-gray-300"><strong>Hostel:</strong> {allocation.hostel}</p>
            <p className="text-gray-300"><strong>Room No:</strong> {allocation.room}</p>
            <p className="text-gray-300"><strong>Bed No:</strong> {allocation.bed}</p>
            <p className="text-gray-300"><strong>G-mail:</strong> {allocation.gmail}</p>
           
          </motion.div>
        )}
     

<button
  onClick={() => window.location.href = "https://hospitality-management-system-nljq.onrender.com/api/students/export-excel/male"}
  className="w-full mt-4 rounded-md bg-green-600 py-2 font-medium text-white transition-colors hover:bg-blue-700"
>
  Export Male Excel
</button>

<button
  onClick={() => window.location.href = "https://hospitality-management-system-nljq.onrender.com/api/students/export-excel/female"}
  className="w-full mt-4 rounded-md bg-pink-600 py-2 font-medium text-white transition-colors hover:bg-pink-700"
>
  Export Female Excel
</button>


        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed right-4 top-4 rounded-md p-4 text-white ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Checkin;




