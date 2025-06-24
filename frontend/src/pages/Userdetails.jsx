"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const UserDetails = () => {
  const [userData, setUserData] = useState({
    id: "",
  })

  const [retrievedData, setRetrievedData] = useState(null)
  const [toast, setToast] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { id } = userData

    const idPattern = /^TZK25[A-Z0-9]*$/i;

    if (!idPattern.test(id)) {
      showToast("Invalid ID! The ID should start with 'TZK25'", "error")
      setRetrievedData(null)
      return
    }

    try {
      const response = await fetch(`https://hospitality-management-system-nljq.onrender.com/api/students/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setRetrievedData(data.user)
        showToast("User Found!", "success")
      } else {
        setRetrievedData(null)
        showToast(data.message || "User not found", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Something went wrong. Please try again.", "error")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-lg bg-gray-800 bg-opacity-50 p-8 shadow-lg backdrop-blur-lg"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-white">User Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="ENTER ID"
              value={userData.id}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Submit
          </motion.button>
        </form>

        <AnimatePresence>
          {retrievedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-2 rounded-md bg-gray-700 bg-opacity-50 p-4 text-white"
            >
              <p>
                <strong>Name:</strong> {retrievedData.name || "STUDENT CHECKOUT"}
              </p>
              <p>
                <strong>Gender:</strong> {retrievedData.gender}
              </p>
              <p>
                <strong>Hostel:</strong> {retrievedData.hostel || "STUDENT CHECKOUT"}
              </p>
              <p>
                <strong>Room:</strong> {retrievedData.room || "STUDENT CHECKOUT"}
              </p>
              <p>
                <strong>Bed:</strong> {retrievedData.bed || "STUDENT CHECKOUT"}
              </p>
              <p>
                <strong>Check-In Time:</strong>{" "}
                {retrievedData.checkInTime
                  ? new Date(retrievedData.checkInTime).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })
                  : "N/A"}
              </p>
              <p>
                <strong>Check-Out Time:</strong>{" "}
                {retrievedData.checkOutTime
                  ? new Date(retrievedData.checkOutTime).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })
                  : "N/A"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className={`fixed right-4 top-4 rounded-md p-4 text-white ${
                toast.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default UserDetails

