import { useState, useEffect } from "react";
import { IoMdCreate } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { MdGroups } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navigate = useNavigate();

   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  // Ensure sidebar is always open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
      else setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed md:relative z-50 top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-0 md:w-16"} overflow-hidden`}
      >
       

        <div className="flex justify-center mb-6 bg-white w-24 rounded-xl mx-20 my-6">
          <img src="/Images/BIET-Jhansi-Logo.webp" alt="Logo" className="h-24 w-auto" />
        </div>


        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/create-drive"
                className="flex items-center gap-x-2 p-2 hover:bg-gray-700 rounded"
              >
                <IoMdCreate className="text-lg" />
                {isOpen ? "Create Drive" : "CD"}
              </Link>
            </li>
            <li>
              <Link
                to="/view-drives"
                className="flex items-center gap-x-2 p-2 hover:bg-gray-700 rounded"
              >
                <CiViewList className="text-lg" />
                {isOpen ? "View Drives" : "VD"}
              </Link>
            </li>
            <li>
              <Link
                to="/contact-details"
                className="flex items-center gap-x-2 p-2 hover:bg-gray-700 rounded"
              >
                <MdGroups className="text-lg" />
                {isOpen ? "Contact Details of Teams" : "CDT"}
              </Link>
            </li>
            <li>
               <button
                      onClick={handleLogout}
                      className="flex items-center gap-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 w-full text-left"
                    >
                      <IoMdLogOut className="text-lg" />
                      Logout
                    </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
