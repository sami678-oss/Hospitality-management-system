

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [totalArrivals, setTotalArrivals] = useState(0); 
  const [totalStudentsLeft, setTotalStudentsLeft] = useState(0); 

  useEffect(() => {
    const fetchHostelStats = async () => {
      try {
        const response = await fetch("https://hospitality-management-system-nljq.onrender.com/api/rooms/hostel-stats");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setStats(data);
      } catch (error) {
        console.error("Error fetching hostel stats:", error);
      }
    };

    fetchHostelStats();
  }, []);

  useEffect(() => {
    const fetchRecentCheckIns = async () => {
      try {
        const response = await fetch("https://hospitality-management-system-nljq.onrender.com/api/students/recent-checkins");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRecentCheckIns(data); // Dynamically update the check-ins
      } catch (error) {
        console.error("Error fetching recent check-ins:", error);
      }
    };

    fetchRecentCheckIns();
  }, []);

  // Fetch the total number of students who have arrived
  useEffect(() => {
    const fetchTotalArrivals = async () => {
      try {
        const response = await fetch("https://hospitality-management-system-nljq.onrender.com/api/total-arrivals");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTotalArrivals(data.totalArrivals); // Set the total arrivals count
      } catch (error) {
        console.error("Error fetching total arrivals:", error);
      }
    };

    fetchTotalArrivals();
  }, []);

  // Fetch the total number of students who have checked out
  useEffect(() => {
    const fetchTotalStudentsLeft = async () => {
      try {
        const response = await fetch("https://hospitality-management-system-nljq.onrender.com/api/total-left");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTotalStudentsLeft(data.totalLeft); // Set the total students left count
      } catch (error) {
        console.error("Error fetching total students left:", error);
      }
    };

    fetchTotalStudentsLeft();
  }, []);

  const boysHostel = stats?.boy || {};
  const girlsHostel = stats?.girl || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[ 
              { title: "Total Students Arrived", value: totalArrivals },
              { title: "Total Students Left", value: totalStudentsLeft }, 
              { title: "Boys Rooms Filled", value: boysHostel.filledRooms || 0 },
              { title: "Girls Rooms Filled", value: girlsHostel.filledRooms || 0 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-lg font-semibold mb-2">{stat.title}</h2>
                <p className="text-4xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Hostel Occupancy</h2>
          <div className="flex justify-around">
            {[ 
              { title: "I3", value: boysHostel.totalStudents || 0 },
              { title: "K4", value: girlsHostel.totalStudents || 0 },
            ].map((hostel, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2">
                  <div className="text-3xl font-bold">{hostel.value}</div>
                </div>
                <h3 className="text-lg font-semibold">{hostel.title}</h3>
                <p className="text-sm text-gray-300">Total Students</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Recent Check-Ins</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-4 text-left">TeckId</th>
                <th className="py-2 px-4 text-left">Guest Name</th>
                <th className="py-2 px-4 text-left">Gender</th>
                <th className="py-2 px-4 text-left">Check-In Date</th>
                <th className="py-2 px-4 text-left">Check-Out Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCheckIns.map((checkIn, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-700"
                >
                  <td className="py-2 px-4">{checkIn.teckziteId}</td>
                  <td className="py-2 px-4">{checkIn.name}</td>
                  <td className="py-2 px-4">{checkIn.gender}</td>
                  <td className="py-2 px-4">
                    {checkIn.checkInTime
                      ? new Date(checkIn.checkInTime).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {checkIn.checkOutTime
                      ? new Date(checkIn.checkOutTime).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : "N/A"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
