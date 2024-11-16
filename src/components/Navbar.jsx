import { signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseconfig";
import Modal from "./modal";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State for logout confirmation modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal
  const [user, setUser] = useState(null); // State to store logged-in user info
  const [justRegistered, setJustRegistered] = useState(false); // Track if user just registered
  const navigate = useNavigate();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setJustRegistered(false); // Reset this state if the user logs in
      }
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Handle the case when the user registers
  useEffect(() => {
    if (window.location.pathname === "/login" && !user) {
      const registeredFlag = sessionStorage.getItem("justRegistered");
      if (registeredFlag) {
        setJustRegistered(true); // Show the "just registered" state
        sessionStorage.removeItem("justRegistered"); // Clear the flag
      }
    }
  }, [user]);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Show the logout confirmation modal
  const showLogoutModal = () => {
    setIsLogoutModalOpen(true); // Open the confirmation modal
  };

  // Handle user confirming logout
  const handleConfirmLogout = async () => {
    try {
      await signOut(auth); // Log out user
      setIsLogoutModalOpen(false); // Close confirmation modal
      setIsSuccessModalOpen(true); // Open success modal
      setTimeout(() => {
        setIsSuccessModalOpen(false);
        navigate("/login"); // Redirect to login page after success modal
      }, 1500); // Delay to show success modal
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle user canceling logout
  const cancelLogout = () => {
    setIsLogoutModalOpen(false); // Simply close the modal, do nothing
  };

  return (
    <div className="navbar bg-white shadow-md px-4 fixed w-full z-50">
      {/* Left Section: Navigation */}
      <div className="flex-1">
        <ul className="flex gap-4 ml-5">
          <li>
            <Link to="/" className="text-gray-700 text-lg hover:text-blue-600">
              Home
            </Link>
          </li>
          {user && !justRegistered && ( // Show Dashboard only if the user is logged in and not just registered
            <li>
              <Link
                to="/dashboard"
                className="text-gray-700 text-lg hover:text-blue-600"
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Center Section: Logo */}
      <div className="flex-1 text-center">
        <Link to="/" className="text-2xl font-semibold text-gray-800">
          Blogging App
        </Link>
      </div>

      {/* Right Section: Conditional Rendering */}
      <div className="flex-none gap-4">
        {!user || justRegistered ? (
          // Show Login and Register if no user is logged in or just registered
          <ul className="flex gap-4">
            <li>
              <Link
                to="/login"
                className="text-gray-700 text-lg hover:text-blue-600"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-gray-700 text-lg hover:text-blue-600"
              >
                Register
              </Link>
            </li>
          </ul>
        ) : (
          // Show Profile and Logout for logged-in users
          <div className="flex items-center gap-4">
            <span className="text-gray-700 text-lg">{user.email}</span>
            <div className="dropdown dropdown-end mr-5">
              <button
                onClick={toggleDropdown}
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </button>
              {isDropdownOpen && (
                <ul className="menu menu-sm dropdown-content bg-white text-gray-700 rounded-box shadow-lg mt-3 w-52 p-2">
                  <li>
                    <Link to="/profile" className="hover:text-blue-600">
                      Profile
                    </Link>
                  </li>
                  <li
                    className="hover:text-blue-600"
                    onClick={showLogoutModal} // Open confirmation modal
                  >
                    <Link>Logout</Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        type="warning"
        message="Are you sure you want to log out?"
        isOpen={isLogoutModalOpen}
        closeModal={cancelLogout} // Close modal without logout
        confirmAction={handleConfirmLogout} // Perform logout if confirmed
        confirmText="Yes"
        cancelText="No"
      />

      {/* Success Modal */}
      <Modal
        type="success"
        message="You have successfully logged out!"
        isOpen={isSuccessModalOpen}
        closeModal={() => setIsSuccessModalOpen(false)} // Close modal
      />
    </div>
  );
};

export default Navbar;
