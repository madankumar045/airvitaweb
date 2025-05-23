import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wind } from 'lucide-react';
import RegisterForm from '../components/Auth/RegisterForm';
import PageTransition from '../components/Layout/PageTransition';

const RegisterPage = () => {
  useEffect(() => {
    document.title = 'AirVita - Create Account';
  }, []);
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center text-white">
              <Wind className="h-10 w-10" />
              <span className="ml-2 text-2xl font-bold">AirVita</span>
            </Link>
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-primary-100">
            Join AirVita to monitor air quality and stay healthy
          </p>
        </div>
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          <RegisterForm />
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;