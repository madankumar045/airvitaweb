import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, History, MessageSquare, Bell, Volume2, LogOut, ChevronRight } from 'lucide-react';
import Header from '../components/Layout/Header';
import BottomNavigation from '../components/Layout/BottomNavigation';
import PageTransition from '../components/Layout/PageTransition';
import { useAuth } from '../contexts/AuthContext';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  to: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, to }) => (
  <Link to={to} className="block">
    <motion.div 
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-3 hover:bg-gray-50"
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center">
        <div className="mr-3 text-gray-500">
          {icon}
        </div>
        <span className="font-medium text-gray-800">{title}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </motion.div>
  </Link>
);

const SettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'AirVita - Settings';
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
      alert('Failed to log out. Please try again.');
    }
  };
  
  return (
    <PageTransition>
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-16 pb-24 px-4">
        <div className="max-w-md mx-auto pt-8">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h2 className="font-medium">{currentUser?.email}</h2>
                  <p className="text-sm text-gray-500">AirVita User</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-lg font-medium text-gray-900 mb-3">Account</h2>
            
            <SettingItem 
              icon={<User className="h-5 w-5" />}
              title="Account Details"
              to="/settings/account"
            />
          </motion.div>
          
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-medium text-gray-900 mb-3">Data & History</h2>
            
            <SettingItem 
              icon={<History className="h-5 w-5" />}
              title="AQI History"
              to="/settings/aqi-history"
            />
            
            <SettingItem 
              icon={<MessageSquare className="h-5 w-5" />}
              title="Chats"
              to="/settings/chats"
            />
          </motion.div>
          
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-medium text-gray-900 mb-3">Preferences</h2>
            
            <SettingItem 
              icon={<Bell className="h-5 w-5" />}
              title="Notification Preferences"
              to="/settings/notifications"
            />
            
            <SettingItem 
              icon={<Volume2 className="h-5 w-5" />}
              title="AI Voice Settings"
              to="/settings/voice"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-error-600"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span className="font-medium">Sign Out</span>
            </button>
          </motion.div>
        </div>
      </div>
      
      <BottomNavigation />
    </PageTransition>
  );
};

export default SettingsPage;