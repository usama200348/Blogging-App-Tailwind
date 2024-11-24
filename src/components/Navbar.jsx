import { signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseconfig";
import Modal from "./modal";
import usama from "../pages/usamaLik.jpeg";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [justRegistered, setJustRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setJustRegistered(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/login" && !user) {
      const registeredFlag = sessionStorage.getItem("justRegistered");
      if (registeredFlag) {
        setJustRegistered(true);
        sessionStorage.removeItem("justRegistered");
      }
    }
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const showLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      setIsLogoutModalOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="navbar bg-[#7749f8] shadow-md px-4 fixed w-full z-50 flex flex-wrap">
      <div className="flex-1">
        {/* <button */}
          {/* className="block md:hidden text-gray-700 text-xl focus:outline-none active:outline-none" */}
          {/* onClick={toggleMobileMenu} */}
        {/* > */}
          {/* ☰ Mobile menu toggle (hamburger icon) */}
        {/* </button> */}
        <ul
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:flex gap-4 ml-2 md:ml-5`}
        >
          <li>
            <Link
              to="/"
              className="text-gray-700 text-sm md:text-lg hover:text-blue-600 focus:outline-none active:outline-none"
            >
              Home
            </Link>
          </li>
          {user && !justRegistered && (
            <li>
              <Link
                to="/dashboard"
                className="text-gray-700 text-sm md:text-lg hover:text-blue-600 focus:outline-none active:outline-none"
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Center Section */}
      <div className="flex-1 text-center">
        <Link
          to="/"
          className="text-lg md:text-2xl font-semibold text-white focus:outline-none active:outline-none"
        >
          Blogging App
        </Link>
      </div>

      <div className="flex-none gap-2 md:gap-4">
        {!user || justRegistered ? (
          <ul className="flex gap-2 md:gap-4">
            <li>
              <Link
                to="/login"
                className="text-gray-700 text-sm md:text-lg hover:text-blue-600 focus:outline-none active:outline-none"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-gray-700 text-sm md:text-lg hover:text-blue-600 focus:outline-none active:outline-none"
              >
                Register
              </Link>
            </li>
          </ul>
        ) : (
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-white text-sm md:text-lg">
              {user.displayName || "User"}
            </span>

            <div className="dropdown dropdown-end mr-2 md:mr-5">
              <button
                onClick={toggleDropdown}
                className="btn btn-ghost btn-circle avatar focus:outline-none active:outline-none"
              >
                <div className="w-8 md:w-10 rounded-full">
                  <img alt="User Avatar" src={usama} />
                </div>
              </button>
              {isDropdownOpen && (
                <ul className="menu menu-sm dropdown-content bg-white text-gray-700 rounded-box shadow-lg mt-3 w-40 md:w-52 p-2">
                  <li>
                    <Link
                      to="/"
                      className="hover:text-blue-600 focus:outline-none active:outline-none"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-blue-600 focus:outline-none active:outline-none"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="hover:text-blue-600 focus:outline-none active:outline-none"
                    >
                      Profile
                    </Link>
                  </li>
                  <li
                    className="hover:text-blue-600 focus:outline-none active:outline-none"
                    onClick={showLogoutModal}
                  >
                    <Link>Logout</Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        type="warning"
        message="Are you sure you want to log out?"
        isOpen={isLogoutModalOpen}
        closeModal={cancelLogout}
        confirmAction={handleConfirmLogout}
        confirmText="Yes"
        cancelText="No"
      />
      <Modal
        type="success"
        message="You have successfully logged out!"
        isOpen={isSuccessModalOpen}
        closeModal={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default Navbar;
