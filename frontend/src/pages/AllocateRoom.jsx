// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const AllocateRoom = () => {
//   const [rooms, setRooms] = useState({ boysRooms: [], girlsRooms: [] });
//   const [currentBoysPage, setCurrentBoysPage] = useState(1);
//   const [currentGirlsPage, setCurrentGirlsPage] = useState(1);
//   const navigate = useNavigate();
//   const roomsPerPage = 20;

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:4001/api/rooms/hostel-stats"
//         );
//         const data = await response.json();

//         setRooms({
//           boysRooms: data.boy.roomDetails,
//           girlsRooms: data.girl.roomDetails,
//         });
//       } catch (error) {
//         console.error("Error fetching room data:", error);
//       }
//     };

//     fetchRooms();
//   }, []);

//   const paginate = (page, setPage) => setPage(page);

//   const getPaginatedRooms = (roomsArray, currentPage) => {
//     const startIndex = (currentPage - 1) * roomsPerPage;
//     return roomsArray.slice(startIndex, startIndex + roomsPerPage);
//   };

//   const getRoomStatus = (room) => {
//     const maxCapacity = room.maxCapacity || 6;
//     const filledBeds = room.occupants.length;
//     return filledBeds === maxCapacity
//       ? { status: "Fully Occupied", statusClass: "bg-red-500" }
//       : { status: `Available ${maxCapacity - filledBeds} beds`, statusClass: "bg-green-500" };
//   };

//   const handleRoomClick = (room) => {
//     navigate(`/checkin?roomNumber=${room.roomNumber}`);
//   };

//   return (
//     <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
//       <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 to-gray-800 p-4">
//         {["boysRooms", "girlsRooms"].map((type, index) => (
//           <div key={type} className="w-full flex flex-col mb-8">
//             <h2 className="text-center text-3xl font-bold text-white">
//               {type === "boysRooms" ? "Boys' Hostel Rooms" : "Girls' Hostel Rooms"}
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 my-4">
//               {getPaginatedRooms(rooms[type], type === "boysRooms" ? currentBoysPage : currentGirlsPage).map((room, index) => {
//                 const { status, statusClass } = getRoomStatus(room);
//                 return (
//                   <div
//                     key={index}
//                     className="bg-gray-700 p-4 rounded-lg shadow-md text-center text-white cursor-pointer"
//                     onClick={() => handleRoomClick(room)}
//                   >
//                     <h4 className="text-xl">{room.roomNumber}</h4>
//                     <p className="text-sm">Beds Filled: {room.occupants.length}</p>

//                     <div className={`text-xs mt-2 p-2 rounded-md ${statusClass} text-white`}>{status}</div>
//                   </div>
//                 );
//               })}
//             </div>
//             <div className="flex justify-center space-x-2 mt-6">
//               {[...Array(Math.ceil(rooms[type].length / roomsPerPage)).keys()].map((number) => (
//                 <button
//                   key={number + 1}
//                   onClick={() => paginate(number + 1, type === "boysRooms" ? setCurrentBoysPage : setCurrentGirlsPage)}
//                   className={`px-4 py-2 rounded-md ${
//                     number + 1 === (type === "boysRooms" ? currentBoysPage : currentGirlsPage)
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-600 text-white"
//                   }`}
//                 >
//                   {number + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// export default AllocateRoom;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AllocateRoom = () => {
  const [rooms, setRooms] = useState({ boysRooms: [], girlsRooms: [] });
  const [currentBoysPage, setCurrentBoysPage] = useState(1);
  const [currentGirlsPage, setCurrentGirlsPage] = useState(1);
  const navigate = useNavigate();
  const roomsPerPage = 20;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          "http://localhost:4001/api/rooms/hostel-stats"
        );
        const data = await response.json();

        setRooms({
          boysRooms: data.boy.roomDetails,
          girlsRooms: data.girl.roomDetails,
        });
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRooms();
  }, []);

  const paginate = (page, setPage) => setPage(page);

  const getPaginatedRooms = (roomsArray, currentPage) => {
    const startIndex = (currentPage - 1) * roomsPerPage;
    return roomsArray.slice(startIndex, startIndex + roomsPerPage);
  };

  const getRoomStatus = (room) => {
    const maxCapacity = room.maxCapacity || 6;
    const filledBeds = room.occupants.length;
    return filledBeds === maxCapacity
      ? {
          status: "Fully Occupied",
          statusClass: "bg-red-500",
          isAvailable: false,
        }
      : {
          status: `Available ${maxCapacity - filledBeds} beds`,
          statusClass: "bg-green-500",
          isAvailable: true,
        };
  };

  const handleRoomClick = (room) => {
    navigate(`/checkin?roomNumber=${room.roomNumber}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        {["boysRooms", "girlsRooms"].map((type) => (
          <div key={type} className="w-full flex flex-col mb-8">
            <h2 className="text-center text-3xl font-bold text-white">
              {type === "boysRooms"
                ? "Boys' Hostel Rooms"
                : "Girls' Hostel Rooms"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 my-4">
              {getPaginatedRooms(
                rooms[type],
                type === "boysRooms" ? currentBoysPage : currentGirlsPage
              ).map((room, index) => {
                const { status, statusClass, isAvailable } =
                  getRoomStatus(room);
                return (
                  <div
                    key={index}
                    className="bg-gray-700 p-4 rounded-lg shadow-md text-center text-white"
                  >
                    <h4 className="text-xl">{room.roomNumber}</h4>
                    <p className="text-sm">
                      Beds Filled: {room.occupants.length}
                    </p>

                    {/* Only the "Available Beds" button is clickable */}
                    {isAvailable ? (
                      <button
                        className={`text-xs mt-2 p-2 rounded-md ${statusClass} text-white w-full`}
                        onClick={() => handleRoomClick(room)}
                      >
                        {status}
                      </button>
                    ) : (
                      <div
                        className={`text-xs mt-2 p-2 rounded-md ${statusClass} text-white`}
                      >
                        {status}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center space-x-2 mt-6">
              {[
                ...Array(Math.ceil(rooms[type].length / roomsPerPage)).keys(),
              ].map((number) => (
                <button
                  key={number + 1}
                  onClick={() =>
                    paginate(
                      number + 1,
                      type === "boysRooms"
                        ? setCurrentBoysPage
                        : setCurrentGirlsPage
                    )
                  }
                  className={`px-4 py-2 rounded-md ${
                    number + 1 ===
                    (type === "boysRooms" ? currentBoysPage : currentGirlsPage)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AllocateRoom;
