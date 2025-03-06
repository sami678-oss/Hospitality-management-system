import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Checkin from "./pages/CheckIn.jsx";
import Userdetails from "./pages/Userdetails.jsx";
import Checkout from "./pages/Checkout.jsx";
import AllocateRoom from "./pages/AllocateRoom.jsx";

const App = () => {
  const [newCheckIn, setNewCheckIn] = useState(null)


  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800">
      <BrowserRouter>
      {/* <FinisherHeader />  */}
      <Sidebar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard  newCheckIn={newCheckIn}/>} />
          <Route path="/checkin" element={<Checkin  setDashboardStats={setNewCheckIn}/>} />
          <Route path="/Userdetails" element={<Userdetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/allocateroom" element={<AllocateRoom />} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
    </div>
  );
};

export default App;
