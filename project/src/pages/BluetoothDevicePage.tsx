import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bluetooth, Battery, AlertTriangle, Cpu, RotateCw, Unplug } from 'lucide-react';
import Header from '../components/Layout/Header';
import BottomNavigation from '../components/Layout/BottomNavigation';
import AqiDisplay from '../components/AirQuality/AqiDisplay';
import PageTransition from '../components/Layout/PageTransition';

interface DeviceInfo {
  id: string;
  name: string;
}

interface BluetoothDeviceData {
  aqi: number | null;
  batteryLevel: number | null;
  connected: boolean;
}

const BluetoothDevicePage = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [deviceData, setDeviceData] = useState<BluetoothDeviceData>({
    aqi: null,
    batteryLevel: null,
    connected: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'AirVita - Bluetooth Device';
    
    // Get stored device info
    const storedDevice = localStorage.getItem('bluetoothDevice');
    
    if (!storedDevice) {
      setError('No Bluetooth device found. Please connect a device first.');
      setLoading(false);
      return;
    }
    
    try {
      const parsedDevice = JSON.parse(storedDevice) as DeviceInfo;
      setDeviceInfo(parsedDevice);
      
      // In a real app, you would reconnect to the device using its ID
      // For this demo, we'll simulate device data
      simulateDeviceConnection(parsedDevice);
    } catch (error) {
      console.error('Error parsing device info:', error);
      setError('Invalid device information. Please reconnect your device.');
      setLoading(false);
    }
  }, []);
  
  const simulateDeviceConnection = (device: DeviceInfo) => {
    // Simulate connecting to device
    setTimeout(() => {
      // Generate mock data
      const mockAqi = Math.floor(Math.random() * 60) + 10; // Random AQI between 10 and 70
      const mockBattery = Math.floor(Math.random() * 30) + 70; // Random battery between 70% and 100%
      
      setDeviceData({
        aqi: mockAqi,
        batteryLevel: mockBattery,
        connected: true
      });
      
      setLoading(false);
    }, 2000);
  };
  
  const handleDisconnect = () => {
    // In a real app, you would disconnect from the Bluetooth device
    localStorage.removeItem('bluetoothDevice');
    navigate('/');
  };
  
  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate refreshing device data
    setTimeout(() => {
      const mockAqi = Math.floor(Math.random() * 60) + 10;
      const mockBattery = Math.floor(Math.random() * 30) + 70;
      
      setDeviceData({
        ...deviceData,
        aqi: mockAqi,
        batteryLevel: mockBattery
      });
      
      setLoading(false);
    }, 1500);
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bluetooth Device</h1>
            {deviceInfo && (
              <div className="flex items-center text-gray-600">
                <Bluetooth className="h-5 w-5 mr-1" />
                <span>{deviceInfo.name || 'AirVita Device'}</span>
              </div>
            )}
          </motion.div>
          
          {error ? (
            <motion.div 
              className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
              >
                Return to Home
              </button>
            </motion.div>
          ) : (
            <>
              {deviceData.connected && deviceData.aqi !== null && (
                <AqiDisplay 
                  aqi={deviceData.aqi} 
                  location="Device Reading"
                  source="AirVita Device"
                  isLoading={loading}
                />
              )}
              
              <motion.div
                className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Device Information</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  {loading ? (
                    <>
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-700">
                          <Cpu className="h-5 w-5 mr-2 text-gray-500" />
                          <span>Device Status</span>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800">
                          Connected
                        </span>
                      </div>
                      
                      {deviceData.batteryLevel !== null && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-700">
                            <Battery className="h-5 w-5 mr-2 text-gray-500" />
                            <span>Battery Level</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div 
                                className={`h-full rounded-full ${
                                  deviceData.batteryLevel > 50 
                                    ? 'bg-success-500' 
                                    : deviceData.batteryLevel > 20 
                                      ? 'bg-warning-500' 
                                      : 'bg-error-500'
                                }`}
                                style={{ width: `${deviceData.batteryLevel}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{deviceData.batteryLevel}%</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="bg-gray-50 px-4 py-3 flex justify-between">
                  <button 
                    onClick={handleRefresh}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={loading}
                  >
                    <RotateCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  
                  <button 
                    onClick={handleDisconnect}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-error-700 bg-white hover:bg-error-50 hover:border-error-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500"
                  >
                    <Unplug className="h-4 w-4 mr-1.5" />
                    Disconnect
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </PageTransition>
  );
};

export default BluetoothDevicePage;