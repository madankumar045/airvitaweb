import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/');
  
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-4 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Link to="/" className="flex flex-col items-center justify-center w-full">
        <div className={`p-2 rounded-full ${activeTab === '/' ? 'bg-primary-50' : ''}`}>
          <Home 
            size={24}
            className={activeTab === '/' ? 'text-primary-600' : 'text-gray-500'} 
          />
        </div>
        <span className={`text-xs mt-1 ${activeTab === '/' ? 'text-primary-600' : 'text-gray-500'}`}>
          Home
        </span>
      </Link>
      
      <Link to="/settings" className="flex flex-col items-center justify-center w-full">
        <div className={`p-2 rounded-full ${activeTab.includes('/settings') ? 'bg-primary-50' : ''}`}>
          <User 
            size={24}
            className={activeTab.includes('/settings') ? 'text-primary-600' : 'text-gray-500'} 
          />
        </div>
        <span className={`text-xs mt-1 ${activeTab.includes('/settings') ? 'text-primary-600' : 'text-gray-500'}`}>
          Account
        </span>
      </Link>
    </motion.div>
  );
};

export default BottomNavigation;