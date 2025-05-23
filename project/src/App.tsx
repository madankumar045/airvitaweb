import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AirQualityPage from './pages/AirQualityPage';
import SettingsPage from './pages/SettingsPage';
import AccountDetailsPage from './pages/settings/AccountDetailsPage';
import AqiHistoryPage from './pages/settings/AqiHistoryPage';
import ChatsPage from './pages/settings/ChatsPage';
import NotificationsPage from './pages/settings/NotificationsPage';
import VoiceSettingsPage from './pages/settings/VoiceSettingsPage';
import BluetoothDevicePage from './pages/BluetoothDevicePage';
import { AnimatePresence } from 'framer-motion';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  const { currentUser } = useAuth();
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);
  
  useEffect(() => {
    // Check if Web Bluetooth API is available
    setIsBluetoothAvailable('bluetooth' in navigator);
  }, []);
  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<HomePage isBluetoothAvailable={isBluetoothAvailable} />} />
        <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!currentUser ? <RegisterPage /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route path="/air-quality" element={
          <ProtectedRoute>
            <AirQualityPage />
          </ProtectedRoute>
        } />
        <Route path="/bluetooth-device" element={
          <ProtectedRoute>
            <BluetoothDevicePage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/settings/account" element={
          <ProtectedRoute>
            <AccountDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/settings/aqi-history" element={
          <ProtectedRoute>
            <AqiHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/settings/chats" element={
          <ProtectedRoute>
            <ChatsPage />
          </ProtectedRoute>
        } />
        <Route path="/settings/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        <Route path="/settings/voice" element={
          <ProtectedRoute>
            <VoiceSettingsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default App;