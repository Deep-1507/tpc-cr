// HRMasterData.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const HRMasterData = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [error, setError] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const observer = useRef();

  // Secure decoy password
  const SECURE_PASSWORD = "Maverick_clear_to_enage_30";

  // Fetch paginated data
  const fetchData = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${apiBaseUrl}/api/v1/drive/hr-master-data?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newData = response.data.data || [];
      setData((prev) => [...prev, ...newData]);
      setHasMore(page < response.data.totalPages);
    } catch (error) {
      console.error("Error fetching HR master data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, apiBaseUrl, loading]);

  useEffect(() => {
    if (passwordVerified) {
      fetchData();
    }
  }, [fetchData, passwordVerified]);

  // Infinite scroll observer
  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Password check
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === SECURE_PASSWORD) {
      setPasswordVerified(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (!passwordVerified) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-xl font-bold mb-4 text-center">
            High Security Access
          </h2>
          <p className="mb-4 text-sm text-gray-600 text-center">
            Kindly enter the high security password sent to your registered mail.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring focus:border-blue-400"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Navbar />

        <div className="p-6 ml-4 py-4 h-screen overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">HR Master Data</h1>

          <div className="overflow-x-auto shadow-lg rounded-lg border">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="py-3 px-4 border">S.No</th>
                  <th className="py-3 px-4 border">Company Name</th>
                  <th className="py-3 px-4 border">Name</th>
                  <th className="py-3 px-4 border">Email</th>
                  <th className="py-3 px-4 border">Contact No</th>
                  <th className="py-3 px-4 border">LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => {
                    const contactNo =
                      typeof row["Contact No"] === "object"
                        ? Object.values(row["Contact No"])[0]
                        : row["Contact No"] || "";

                    return (
                      <tr
                        key={row._id || index}
                        ref={index === data.length - 1 ? lastRowRef : null}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="border border-gray-300 px-4 py-2">
                          {(page - 1) * 10 + (index + 1)}
                        </td>
                        <td className="py-2 px-4 border">
                          {row["Company Name"] || "-"}
                        </td>
                        <td className="py-2 px-4 border">{row["Name"] || "-"}</td>
                        <td className="py-2 px-4 border">{row["Email"] || "-"}</td>
                        <td className="py-2 px-4 border">{contactNo}</td>
                        <td className="py-2 px-4 border">
                          {row["Linked ID"] ? (
                            <a
                              href={row["Linked ID"]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Profile
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 text-center text-gray-500 border"
                    >
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Loader */}
          {loading && (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRMasterData;