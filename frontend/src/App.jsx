import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import Employees from "./pages/Employees";
import EditEmployee from "./pages/EditEmployee";
import AddEmployee from "./pages/AddEmployee";
import Clients from "./pages/Clients";
import EditClient from "./pages/EditClient";
import AddClient from "./pages/AddClient";
import Projects from "./pages/Projects";
import EditProject from "./pages/EditProject";
import AddProject from "./pages/AddProject";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard and Resource management routes inside DashboardLayout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/edit/:id" element={<EditEmployee />} />
          <Route path="/employees/edit" element={<EditEmployee />} />
          
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/clients/edit/:id" element={<EditClient />} />
          <Route path="/clients/edit" element={<EditClient />} />
          
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/add" element={<AddProject />} />
          <Route path="/projects/edit/:id" element={<EditProject />} />
          <Route path="/projects/edit" element={<EditProject />} />
        </Route>
      </Routes>
    </>
  );
}