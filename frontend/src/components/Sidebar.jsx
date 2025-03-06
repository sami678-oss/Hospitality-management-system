import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegClock,
    FaTimes,
    FaBed
} from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true); 
    const menuItem = [
        {
            path: "/",
            name: "Dashboard",
            icon: <FaTh />
        },
        {
            path: "/userdetails",
            name: "UserDetails",
            icon: <FaUserAlt />
        },
        {
            path: "/checkin",
            name: "CheckIn",
            icon: <FaRegClock />
        },
        {
            path: "/checkout",
            name: "CheckOut",
            icon: <FaRegClock />
        },
        {
            path: "/allocateroom",
            name: "AllocateRoom",
            icon: < FaBed/>
        },
    ];

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // Toggle the sidebar visibility
    };

    return (
        <div className="container">
            {/* Mobile Toggle Button */}
            {!isOpen && (
                <div className="bars" onClick={toggleSidebar}>
                    <FaBars />
                </div>
            )}
            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="top_section">
                    <div className="header">
                        <div className="logo-container">
                            {/* <div className="logo-icon">HM</div> */}
                            <div>
                                <img src="/rgukt.png" alt="" className='h-10 w-10 ms-1 sm:h-15 sm:w-15 sm:ms-2'/>
                            </div>
                            <h1 className="font-bold ms-6">Hospitality Management</h1>
                        </div>
                        {/* Close Button */}
                        <div className="close-icon" onClick={toggleSidebar}>
                            <FaTimes />
                        </div>
                    </div>
                </div>
                {menuItem.map((item, index) => (
                    <NavLink to={item.path} key={index} className="link" activeClassName="active">
                        <div className="icon">{item.icon}</div>
                        <div className="link_text">{item.name}</div>
                    </NavLink>
                ))}
            </div>
            <main className={`${isOpen ? 'shifted' : ''}`}>{children}</main>
        </div>
    );
};

export default Sidebar;
