import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, User, Shield } from 'lucide-react';
import Header from '../../components/Layout/Header';
import BottomNavigation from '../../components/Layout/BottomNavigation';
import PageTransition from '../../components/Layout/PageTransition';
import { useAuth } from '../../contexts/AuthContext';

const AccountDetailsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'AirVita - Account Details';
  }, []);
  
  const goBack = () => {
    navigate('/settings');
  };
  
  return (
    <PageTransition>
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-16 pb-24 px-4">
        <div className="max-w-md mx-auto pt-8">
          <motion.div 
            className="mb-8 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              onClick={goBack}
              className="mr-2 p-2 rounded-full hover:bg-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Account Details</h1>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{currentUser?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-500">
                <Mail className="h-5 w-5 mr-2" />
                <span>Email verification: <span className="text-success-600 font-medium">Verified</span></span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Security</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <button className="flex items-center text-primary-600 font-medium">
                <Shield className="h-5 w-5 mr-2" />
                <span>Change Password</span>
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Account Management</h2>
            </div>
            
            <div className="p-4">
              <button className="text-error-600 font-medium">
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <BottomNavigation />
    </PageTransition>
  );
};

export default AccountDetailsPage;