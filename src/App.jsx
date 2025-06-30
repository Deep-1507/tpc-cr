import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import ViewDrives from './pages/ViewDrives';
import ManageDrive from './pages/ManageDrive';
import CreateDrive from './pages/CreateDrive';
import Auth from './pages/Auth';
import TeamDetails from './pages/TeamDetails';
import ProtectedRoute from "./middleware/ProtectedRoute";

function App() {
  return (
    <div className="flex">
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <div className="flex-grow">
            <Routes>
              <Route path="/auth" element={<Auth />} />

              <Route
                path="/create-drive"
                element={
                  <ProtectedRoute>
                    <CreateDrive />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/view-drives"
                element={
                  <ProtectedRoute>
                    <ViewDrives />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-drive/:id"
                element={
                  <ProtectedRoute>
                    <ManageDrive />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact-details"
                element={
                  <ProtectedRoute>
                    <TeamDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
}

export default App;