// ViewDrives.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ViewDrives = () => {
  const [drives, setDrives] = useState([]); // Initialize as an array
  const [searchParams, setSearchParams] = useState({
    companyName: "",
    coodName: "",
    phoneNumber: "",
    status: "",
    dateCreated: "",
    dateUpdated: "",
  });

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage

        const response = await axios.get(`${apiBaseUrl}/api/v1/drive/drives`, {
          params: searchParams,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          const sortedDrives = response.data.sort(
            (a, b) => new Date(b.dateUpdated) - new Date(a.dateUpdated)
          );
          setDrives(sortedDrives);
        } else {
          console.error("Unexpected response format:", response.data);
          setDrives([]);
        }
      } catch (error) {
        console.error("Error fetching drives:", error);
        setDrives([]);
      }
    };
    fetchDrives();
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 1:
        return "border-green-500";
      case 2:
        return "border-red-500";
      case 3:
        return "border-blue-500";
      case 4:
        return "border-yellow-500";
      default:
        return "border-gray-500"; // default color
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    let yOffset = 10;

    // Load logo from public folder and convert to base64
    const loadLogoAsBase64 = async () => {
      const response = await fetch("/Images/Report_header.png");
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };

    const logoBase64 = await loadLogoAsBase64();

    // Add logo image
    doc.addImage(logoBase64, "WEBP", 0, 0, 210, 40);

    // Add centered heading
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Outreach Division Report", 105, 50, { align: "center" });

    // Horizontal line below heading
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 55, 200, 55);

    yOffset = 70;

    drives.forEach((drive, index) => {
      if (index > 0) {
        doc.addPage();
        yOffset = 10;
      }

      doc.setFontSize(16);
      doc.text(`Company ${index + 1}: ${drive.companyName}`, 10, yOffset);
      yOffset += 8;

      doc.setFontSize(12);
      doc.text(`Coordinator assigned: ${drive.coodName}`, 10, yOffset);
      yOffset += 6;
      doc.text(`Phone: ${drive.phoneNumber}`, 10, yOffset);
      yOffset += 6;
      doc.text(`Status: ${drive.status}`, 10, yOffset);
      yOffset += 6;
      doc.text(`Created: ${drive.dateCreated}`, 10, yOffset);
      yOffset += 6;
      doc.text(`Last Updated: ${drive.dateUpdated}`, 10, yOffset);
      yOffset += 10;

      autoTable(doc, {
        startY: yOffset,
        head: [["HR Details"]],
        body: drive.hrDetails.map((hr) => [hr || ""]),
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        theme: "grid",
        showHead: "everyPage",
      });
      yOffset = doc.lastAutoTable.finalY + 6;

      autoTable(doc, {
        startY: yOffset,
        head: [["Message", "Reminder Date", "Reminder Message"]],
        body: drive.driveDetails.map((d) => [
          d.message || "",
          d.reminder?.date
            ? new Date(d.reminder.date).toLocaleDateString()
            : "",
          d.reminder?.reminderMessage || "",
        ]),
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        theme: "grid",
        showHead: "everyPage",
      });
      yOffset = doc.lastAutoTable.finalY + 6;

      drive.driveClosingDetails.forEach((closing) => {
        doc.text(
          `Closing Message: ${closing.closingMessage || ""}`,
          10,
          yOffset
        );
        yOffset += 6;

        autoTable(doc, {
          startY: yOffset,
          head: [["Participated", "Placed", "Document Links"]],
          body: closing.closingDetails.map((d) => [
            d.totalParticipated ?? "N/A",
            d.totalPlaced ?? "N/A",
            (d.linksToDocs || []).join(", "),
          ]),
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
          },
          theme: "grid",
          showHead: "everyPage",
        });
        yOffset = doc.lastAutoTable.finalY + 10;
      });
    });

    doc.save("Outreach_Division_Report.pdf");
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
        <div className="p-6 ml-4 py-4 h-screen overflow-y-auto">
          <h1 className="text-3xl font-bold mb-4">View Drives</h1>
          <div className="mb-6">
            <h2 className="text-xl mb-2">Search Drives:</h2>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={searchParams.companyName}
              onChange={handleSearchChange}
              className="p-2 border rounded mr-2"
            />
            <input
              type="text"
              name="coodName"
              placeholder="Coordinator Name"
              value={searchParams.coodName}
              onChange={handleSearchChange}
              className="p-2 border rounded mr-2"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={searchParams.phoneNumber}
              onChange={handleSearchChange}
              className="p-2 border rounded mr-2"
            />
            <input
              type="number"
              name="status"
              placeholder="Status"
              value={searchParams.status}
              onChange={handleSearchChange}
              className="p-2 border rounded mr-2"
            />
            <input
              type="date"
              name="dateCreated"
              value={searchParams.dateCreated}
              onChange={handleSearchChange}
              className="p-2 border rounded mr-2"
            />
            <input
              type="date"
              name="dateUpdated"
              value={searchParams.dateUpdated}
              onChange={handleSearchChange}
              className="p-2 border rounded"
            />
          </div>

          <button
            onClick={generatePDF}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Generate Report
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drives.length > 0 ? (
              drives.map((drive) => (
                <Link
                  to={`/manage-drive/${drive._id}`} // Link to the details page
                  key={drive._id}
                  className={`border-2 p-4 rounded-lg transition duration-200 ${getBorderColor(
                    drive.status
                  )}`}
                >
                  <h3 className="text-2xl font-semibold">
                    {drive.companyName}
                  </h3>
                  <p>
                    <strong>Coordinator:</strong> {drive.coodName}
                  </p>
                  <p>
                    <strong>Status:</strong> {' '}
                    {drive.status == 1 ? 'Active':
                    drive.status == 2 ? 'Inactive':
                    drive.status == 3 ? 'Completed':
                    'Pending'}
                  </p>

                  
                  <p>
                    <strong>Phone:</strong> {drive.phoneNumber}
                  </p>
                  <p>
                    <strong>Date Created:</strong> {drive.dateCreated}
                  </p>
                  <p>
                    <strong>Date Updated:</strong> {drive.dateUpdated}
                  </p>
                </Link>
              ))
            ) : (
              <p>No drives found. Please adjust your search criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDrives;
