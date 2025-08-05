import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSnackbar } from "notistack";

const ManageDrive = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [driveData, setDriveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDriveData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${apiBaseUrl}/api/v1/drive/drives/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDriveData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchDriveData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriveData({ ...driveData, [name]: value });
  };

  const handleNestedInputChange = (e, section, index, key) => {
    const updatedSection = [...driveData[section]];
    updatedSection[index][key] = e.target.value;
    setDriveData({ ...driveData, [section]: updatedSection });
  };

  const handleDeepNestedInputChange = (
    e,
    section,
    sectionIndex,
    subSection,
    subIndex,
    key,
    subKeyIndex = null
  ) => {
    const updatedData = { ...driveData };
    const value = e.target.value;

    if (!Array.isArray(updatedData[section])) return;

    if (!Array.isArray(updatedData[section][sectionIndex][subSection])) {
      updatedData[section][sectionIndex][subSection] = [];
    }

    if (subKeyIndex !== null) {
      if (
        !Array.isArray(
          updatedData[section][sectionIndex][subSection][subIndex][key]
        )
      ) {
        updatedData[section][sectionIndex][subSection][subIndex][key] = [];
      }
      updatedData[section][sectionIndex][subSection][subIndex][key][
        subKeyIndex
      ] = value;
    } else {
      updatedData[section][sectionIndex][subSection][subIndex][key] = value;
    }

    setDriveData(updatedData);
  };

  const handleRemoveNestedDetail = (section, index) => {
    const updatedSection = driveData[section].filter((_, i) => i !== index);
    setDriveData({ ...driveData, [section]: updatedSection });
  };

  const handleAddNewDriveDetail = () => {
    setDriveData({
      ...driveData,
      driveDetails: [
        ...driveData.driveDetails,
        {
          reminder: { date: "", reminderMessage: "" },
          message: "",
        },
      ],
    });
  };

  const handleAddNewHRDetail = () => {
    setDriveData({
      ...driveData,
      hrDetails: [...driveData.hrDetails, ""],
    });
  };

  const handleSubmit = async () => {
    const updatedDriveData = {
      ...driveData,
      dateUpdated: new Date().toISOString().split("T")[0],
    };

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiBaseUrl}/api/v1/drive/drives/${id}`,
        updatedDriveData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      enqueueSnackbar("Drive details updated successfully!", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(
        "Failed to update details: " +
          (err.response?.data?.message || err.message),
        { variant: "error" }
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-4 bg-white rounded ml-4 py-4 h-screen overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">
            Edit Drive: {driveData.companyName}
          </h2>

          <div className="mb-4">
            <label>Company Name:</label>
            <input
              type="text"
              name="companyName"
              value={driveData.companyName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label>HR Details:</label>
            {driveData.hrDetails.map((hr, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={hr}
                  onChange={(e) =>
                    handleNestedInputChange(e, "hrDetails", index, "")
                  }
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => handleRemoveNestedDetail("hrDetails", index)}
                  className="ml-2 bg-red-500 text-white p-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddNewHRDetail}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add HR Detail
            </button>
          </div>

          <div className="mb-4">
            <label>Coordinator Name:</label>
            <input
              type="text"
              name="coodName"
              value={driveData.coodName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={driveData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={driveData.status}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="1">Active</option>
              <option value="2">Inactive</option>
              <option value="3">Completed</option>
              <option value="4">Pending</option>
            </select>
          </div>

          <div className="mb-4">
            <label>Date Created:</label>
            <input
              type="date"
              name="dateCreated"
              value={driveData.dateCreated}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label>Date Updated:</label>
            <input
              type="date"
              name="dateUpdated"
              value={driveData.dateUpdated}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <h3 className="text-xl font-semibold mb-2">Drive Details:</h3>
          {driveData.driveDetails.map((detail, index) => (
            <div
              key={index}
              className="mb-2 p-2 border border-gray-300 rounded"
            >
              <input
                type="text"
                value={detail.message}
                onChange={(e) =>
                  handleNestedInputChange(e, "driveDetails", index, "message")
                }
                placeholder="Message"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="date"
                value={detail.reminder.date}
                onChange={(e) =>
                  handleNestedInputChange(
                    e,
                    "driveDetails",
                    index,
                    "reminder.date"
                  )
                }
                placeholder="Reminder Date"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                value={detail.reminder.reminderMessage}
                onChange={(e) =>
                  handleNestedInputChange(
                    e,
                    "driveDetails",
                    index,
                    "reminder.reminderMessage"
                  )
                }
                placeholder="Reminder Message"
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={() => handleRemoveNestedDetail("driveDetails", index)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={handleAddNewDriveDetail}
            className="bg-blue-500 text-white p-2 rounded mb-4"
          >
            Add Drive Detail
          </button>

          <h3 className="text-xl font-semibold mb-2">Drive Closing Details:</h3>
          {driveData.driveClosingDetails.map((closing, index) => (
            <div
              key={index}
              className="mb-2 p-2 border border-gray-300 rounded"
            >
              <input
                type="text"
                value={closing.closingMessage}
                onChange={(e) =>
                  handleNestedInputChange(
                    e,
                    "driveClosingDetails",
                    index,
                    "closingMessage"
                  )
                }
                placeholder="Closing Message"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                value={closing.closingStatus || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    e,
                    "driveClosingDetails",
                    index,
                    "closingStatus"
                  )
                }
                placeholder="Closing Status"
                className="w-full p-2 border rounded mb-2"
              />

              {Array.isArray(closing.closingDetails) &&
                closing.closingDetails.map((detail, i) => (
                  <div key={i} className="mb-2 p-2">
                    <input
                      type="number"
                      value={detail.totalParticipated || ""}
                      onChange={(e) =>
                        handleDeepNestedInputChange(
                          e,
                          "driveClosingDetails",
                          index,
                          "closingDetails",
                          i,
                          "totalParticipated"
                        )
                      }
                      placeholder="Total Participated"
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="number"
                      value={detail.totalPlaced || ""}
                      onChange={(e) =>
                        handleDeepNestedInputChange(
                          e,
                          "driveClosingDetails",
                          index,
                          "closingDetails",
                          i,
                          "totalPlaced"
                        )
                      }
                      placeholder="Total Placed"
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      value={detail.linksToDocs?.[0] || ""}
                      onChange={(e) =>
                        handleDeepNestedInputChange(
                          e,
                          "driveClosingDetails",
                          index,
                          "closingDetails",
                          i,
                          "linksToDocs",
                          0
                        )
                      }
                      placeholder="Links to Documents"
                      className="w-full p-2 border rounded mb-2"
                    />
                  </div>
                ))}
            </div>
          ))}

          <div>
            <button
              type="submit"
              disabled={saving}
              onClick={handleSubmit}
              className={`w-full ${
                saving ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              } text-white py-2 px-4 rounded flex justify-center items-center`}
            >
              {saving ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDrive;
