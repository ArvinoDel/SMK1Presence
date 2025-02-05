import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ErrorBoundary from "./ErrorBoundary";
import DigitalClock from "@/pages/DigitalClock"; // Import Digital Clock
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/clock" element={<DigitalClock />} /> {/* Halaman baru */}
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
