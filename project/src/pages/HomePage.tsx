import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Layout/Header';
import BottomNavigation from '../components/Layout/BottomNavigation';
import BluetoothConnectButton from '../components/BluetoothPairing/BluetoothConnectButton';
import PageTransition from '../components/Layout/PageTransition';

interface HomePageProps {
  isBluetoothAvailable: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isBluetoothAvailable }) => {
  useEffect(() => {
    document.title = 'AirVita - Home';
  }, []);
  
  return (
    <PageTransition>
      <Header transparent />
      
      <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-800 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-24">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Monitor Air Quality with AirVita
            </h1>
            <p className="text-primary-100 text-lg max-w-md mx-auto">
              Real-time air quality monitoring for better health decisions.
            </p>
          </motion.div>
          
          <motion.div 
            className="w-80 h-80 mb-10 relative rounded-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPFnDpJrilGa300_ZENmRMWWWhmpgruZ62w&s"
              alt="Digital air purifier mask" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <BluetoothConnectButton isAvailable={isBluetoothAvailable} />
        </div>
      </div>
      
      <BottomNavigation />
    </PageTransition>
  );
};

export default HomePage;