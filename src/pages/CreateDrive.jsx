import { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const CreateDrive = () => {
  const { enqueueSnackbar } = useSnackbar();

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  // FORM STATE
  const [formData, setFormData] = useState({
    companyName: "",
    hrDetails: [""],
    coodName: "",
    phoneNumber: "",
    status: "",
    dateCreated: new Date().toISOString().split("T")[0],
    dateUpdated: new Date().toISOString().split("T")[0],
    driveDetails: [{ message: "", reminder: { date: "", reminderMessage: "" } }],
    driveClosingDetails: [
      {
        closingMessage: "",
        closingStatus: "",
        closingDetails: [
          { totalParticipated: "", totalPlaced: "", linksToDocs: [""] },
        ],
      },
    ],
  });

  // Handle simple field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle array field changes (e.g., hrDetails)
  const handleArrayChange = (e, index, key) => {
    const { value } = e.target;
    const updated = [...formData[key]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  // Handle nested fields (e.g., reminder.message, etc.)
  const handleNestedChange = (e, index, parentKey, childPath) => {
    const updatedArray = [...formData[parentKey]];
    const pathParts = childPath.split(".");
    if (pathParts.length === 2) {
      updatedArray[index] = {
        ...updatedArray[index],
        [pathParts[0]]: {
          ...updatedArray[index][pathParts[0]],
          [pathParts[1]]: e.target.value,
        },
      };
    } else {
      updatedArray[index] = {
        ...updatedArray[index],
        [childPath]: e.target.value,
      };
    }
    setFormData((prev) => ({ ...prev, [parentKey]: updatedArray }));
  };

  const addHrField = () =>
    setFormData((prev) => ({ ...prev, hrDetails: [...prev.hrDetails, ""] }));

  const removeHrField = (index) =>
    setFormData((prev) => ({
      ...prev,
      hrDetails: prev.hrDetails.filter((_, i) => i !== index),
    }));

  const addDriveDetail = () =>
    setFormData((prev) => ({
      ...prev,
      driveDetails: [
        ...prev.driveDetails,
        { message: "", reminder: { date: "", reminderMessage: "" } },
      ],
    }));

  const removeDriveDetail = (index) =>
    setFormData((prev) => ({
      ...prev,
      driveDetails: prev.driveDetails.filter((_, i) => i !== index),
    }));

  const addClosingDetail = () =>
    setFormData((prev) => ({
      ...prev,
      driveClosingDetails: [
        {
          closingMessage: "",
          closingStatus: "",
          closingDetails: [
            { totalParticipated: "", totalPlaced: "", linksToDocs: [""] },
          ],
        },
      ],
    }));

  const removeClosingDetail = () =>
    setFormData((prev) => ({ ...prev, driveClosingDetails: [] }));

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    await axios.post(`${apiBaseUrl}/api/v1/drive/drives`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    enqueueSnackbar("Drive created successfully!", { variant: "success" });

    // Reset form
    setFormData({
      companyName: "",
      hrDetails: [""],
      coodName: "",
      phoneNumber: "",
      status: "",
      dateCreated: new Date().toISOString().split("T")[0],
      dateUpdated: new Date().toISOString().split("T")[0],
      driveDetails: [{ message: "", reminder: { date: "", reminderMessage: "" } }],
      driveClosingDetails: [
        {
          closingMessage: "",
          closingStatus: "",
          closingDetails: [
            { totalParticipated: "", totalPlaced: "", linksToDocs: [""] },
          ],
        },
      ],
    });
  } catch (error) {
    enqueueSnackbar(
      "Error creating drive: " + (error?.response?.data?.message || "Unknown error"),
      { variant: "error" }
    );
  }
};

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Form area */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-100 h-full">
          <h1 className="text-2xl font-bold mb-6">Create Drive</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block mb-1" htmlFor="companyName">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* HR Details */}
        <div>
          <label className="block mb-1">HR Details</label>
          {formData.hrDetails.map((hr, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={hr}
                onChange={(e) => handleArrayChange(e, index, "hrDetails")}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeHrField(index)}
                className="mt-1 bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove HR Detail
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addHrField}
            className="mt-1 bg-blue-500 text-white px-2 py-1 rounded"
          >
            Add HR Detail
          </button>
        </div>

        {/* Coordinator Name */}
        <div>
          <label className="block mb-1" htmlFor="coodName">
            Coordinator Name
          </label>
          <input
            type="text"
            id="coodName"
            name="coodName"
            value={formData.coodName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Status */}
        <div>
  <label className="block mb-1" htmlFor="status">
    Status
  </label>
  <select
    id="status"
    name="status"
    value={formData.status}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded"
  >
    <option value="" disabled>Select Status</option>
    <option value="1">Active</option>
    <option value="2">Inactive</option>
    <option value="3">Completed</option>
    <option value="4">Pending</option>
  </select>
</div>


        {/* Drive Details */}
        <div>
          <h2 className="font-bold">Drive Details</h2>
          {formData.driveDetails.map((drive, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">Drive Detail {index + 1}</h3>
              <label className="block mb-1">Message</label>
              <input
                type="text"
                value={drive.message}
                onChange={(e) =>
                  handleNestedChange(e, index, "driveDetails", "message")
                }
                className="w-full p-2 border rounded"
              />
              <label className="block mt-2">Reminder Date</label>
              <input
                type="date"
                value={drive.reminder.date}
                onChange={(e) =>
                  handleNestedChange(e, index, "driveDetails", "reminder.date")
                }
                className="w-full p-2 border rounded"
              />
              <label className="block mt-2">Reminder Message</label>
              <input
                type="text"
                value={drive.reminder.reminderMessage}
                onChange={(e) =>
                  handleNestedChange(
                    e,
                    index,
                    "driveDetails",
                    "reminder.reminderMessage"
                  )
                }
                className="w-full p-2 border rounded"
              />

              <button
                type="button"
                onClick={() => removeDriveDetail(index)}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove Drive Detail {index + 1}
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDriveDetail}
            className="mt-1 bg-blue-500 text-white px-2 py-1 rounded"
          >
            Add Drive Detail
          </button>
        </div>

        {/* Closing Details */}
        <div>
          <h2 className="font-bold">Drive Closing Details</h2>
          {formData.driveClosingDetails.length > 0 ? (
            <div className="mb-4">
              <label className="block mb-1">Closing Message</label>
              <input
                type="text"
                value={formData.driveClosingDetails[0].closingMessage}
                onChange={(e) =>
                  handleNestedChange(
                    e,
                    0,
                    "driveClosingDetails",
                    "closingMessage"
                  )
                }
                className="w-full p-2 border rounded"
              />
              <label className="block mt-2">Closing Status</label>
              <input
                type="text"
                value={formData.driveClosingDetails[0].closingStatus}
                onChange={(e) =>
                  handleNestedChange(
                    e,
                    0,
                    "driveClosingDetails",
                    "closingStatus"
                  )
                }
                className="w-full p-2 border rounded"
              />
              {formData.driveClosingDetails[0].closingDetails.map(
                (detail, detailIndex) => (
                  <div key={detailIndex} className="mt-4">
                    <label className="block mb-1">Total Participated</label>
                    <input
                      type="number"
                      value={detail.totalParticipated}
                      onChange={(e) =>
                        handleNestedChange(
                          e,
                          detailIndex,
                          "driveClosingDetails[0].closingDetails",
                          "totalParticipated"
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                    <label className="block mt-2">Total Placed</label>
                    <input
                      type="number"
                      value={detail.totalPlaced}
                      onChange={(e) =>
                        handleNestedChange(
                          e,
                          detailIndex,
                          "driveClosingDetails[0].closingDetails",
                          "totalPlaced"
                        )
                      }
                      className="w-full p-2 border rounded"
                    />
                    {detail.linksToDocs.map((docLink, linkIndex) => (
                      <div key={linkIndex} className="mt-2">
                        <label className="block">Link to Document</label>
                        <input
                          type="text"
                          value={docLink}
                          onChange={(e) =>
                            handleNestedChange(
                              e,
                              linkIndex,
                              "driveClosingDetails[0].closingDetails",
                              "linksToDocs"
                            )
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                )
              )}
              <button
                type="button"
                onClick={removeClosingDetail}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove Closing Details
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={addClosingDetail}
              className="mt-1 bg-blue-500 text-white px-2 py-1 rounded"
            >
              Add Closing Details
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded"
          >
            Create Drive
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDrive;