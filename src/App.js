import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import CreateTrip from "./pages/CreateTrip";
import BoardingCheck from "./pages/BoardingCheck";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />
          
          <Route element={<Layout />}>
            {/* Manager Only */}
            <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
              <Route path="/create-trip" element={<CreateTrip />} />
            </Route>

            {/* Supervisor Only */}
            <Route element={<ProtectedRoute allowedRoles={["supervisor"]} />}>
              <Route path="/boarding-check" element={<BoardingCheck />} />
            </Route>

            {/* Driver Only */}
            <Route element={<ProtectedRoute allowedRoles={["driver"]} />}>
              <Route path="/driver-dashboard" element={<DriverDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;