import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bluetooth } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BluetoothConnectButtonProps {
  isAvailable: boolean;
}

const BluetoothConnectButton: React.FC<BluetoothConnectButtonProps> = ({ isAvailable }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  
  const handleConnect = async () => {
    if (!isAvailable) {
      alert('Bluetooth is not available on this device or browser.');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Request device with filter for AirVita devices
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'AirVita' },
          { services: ['environmental_sensing'] }
        ],
        optionalServices: ['battery_service', 'device_information']
      });
      
      console.log('Device connected:', device);
      
      // Store device information in localStorage (just the id and name for reconnection)
      localStorage.setItem('bluetoothDevice', JSON.stringify({
        id: device.id,
        name: device.name
      }));
      
      // Navigate to device info page
      navigate('/bluetooth-device');
    } catch (error) {
      console.error('Error connecting to Bluetooth device:', error);
      alert('Failed to connect to Bluetooth device. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
    >
      <motion.button
        className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg ${
          isAvailable ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400'
        } transition-colors`}
        onClick={handleConnect}
        disabled={!isAvailable || isConnecting}
        whileHover={isAvailable ? { scale: 1.05 } : {}}
        whileTap={isAvailable ? { scale: 0.95 } : {}}
        animate={isConnecting ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
        transition={{ duration: 2, repeat: isConnecting ? Infinity : 0 }}
      >
        <Bluetooth className="w-16 h-16 text-white" />
      </motion.button>
      <p className="mt-4 text-lg font-medium">
        {isConnecting 
          ? 'Connecting...' 
          : isAvailable 
            ? 'Connect Device' 
            : 'Bluetooth Not Available'
        }
      </p>
      {!isAvailable && (
        <p className="mt-2 text-sm text-gray-500 max-w-xs text-center">
          Your device or browser doesn't support Bluetooth connectivity. Please try a different browser or device.
        </p>
      )}
    </motion.div>
  );
};

export default BluetoothConnectButton;