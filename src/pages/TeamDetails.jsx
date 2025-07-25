// ViewDrives.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const TeamDetails = () => {
  const [users, setUsers] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage

        const response = await axios.get(
          `${apiBaseUrl}/api/v1/drive/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching drives:", error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Form area */}
        <div className="p-6 ml-4 py-4 h-screen overflow-y-auto">
          <h1 className="text-3xl font-bold mb-4">Team Members Details</h1>
          <h3 className="text-2xl font-bold mb-4 text-green-400">
            Click on cards to visit the member's linkedin page associated.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.length > 0 ? (
              users.map((user) => (
                <a
                  href={user.linkedinId}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={user._id}
                  className="border-2 p-4 rounded-lg transition duration-200 block"
                >
                  <h3 className="text-2xl font-semibold">ID: {user._id}</h3>
                  <p>
                    <strong>Name:</strong> {user.firstName} {user.lastName}
                  </p>
                  <p>
                    <strong>Email Id:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Phone No.:</strong> {user.phoneNumber}
                  </p>
                  <p>
                    <strong>Team Name:</strong> {user.teamName}
                  </p>
                  <p>
                    <strong>Position:</strong> {user.position}
                  </p>
                </a>
              ))
            ) : (
              <p>No Members found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
