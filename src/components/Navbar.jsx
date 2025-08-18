import React, { useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { MdGroups } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">
              TPC (BIET-JHS) - CR
            </h1>
          </div>

          {/* Navigation Links - Desktop */}
          {/* <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="#" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                About Us
              </a>
              <a href="#" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Services
              </a>
              <a href="#" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </a>
            </div>
          </div> */}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/create-drive"
              className="flex items-center gap-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              <IoMdCreate className="text-lg" />
              Create Drive
            </Link>

            <Link
              to="/view-drives"
              className="flex items-center gap-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              <CiViewList className="text-lg" />
              View Drives
            </Link>

            <Link
              to="/master-data"
              className="flex items-center gap-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              <CiViewList className="text-lg" />
              HR Master Data
            </Link>

            <Link
              to="/contact-details"
              className="flex items-center gap-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              <MdGroups className="text-lg" />
              Details of Team
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 w-full text-left"
            >
              <IoMdLogOut className="text-lg" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
