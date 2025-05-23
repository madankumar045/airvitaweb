import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Layout/Header';
import BottomNavigation from '../components/Layout/BottomNavigation';
import AqiDisplay from '../components/AirQuality/AqiDisplay';
import PageTransition from '../components/Layout/PageTransition';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const AQI_API_KEY = '72780ee77a6b90ede0d5123a7c75a493';

interface AirQualityData {
  aqi: number;
  location: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

const AirQualityPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const getLocation = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };
  
  const fetchAirQuality = async () => {
    setLoading(true);
    setError('');
    
    try {
      const position = await getLocation();
      setLocationPermission(true);
      
      const { latitude, longitude } = position.coords;
      
      const response = await axios.get(
        `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${AQI_API_KEY}`
      );
      
      if (response.data.status === 'ok') {
        const data: AirQualityData = {
          aqi: response.data.data.aqi,
          location: response.data.data.city.name || 'Your Location',
          latitude,
          longitude,
          timestamp: Date.now()
        };
        
        setAirQualityData(data);
        
        if (currentUser) {
          await setDoc(doc(db, 'aqiHistory', `${currentUser.uid}_${Date.now()}`), {
            userId: currentUser.uid,
            ...data
          });
        }
      } else {
        throw new Error('Failed to fetch air quality data');
      }
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      
      if ((error as Error).message.includes('permission')) {
        setLocationPermission(false);
        setError('Location permission denied. Please enable location services to see air quality data for your area.');
      } else {
        setError('Failed to fetch air quality data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    document.title = 'AirVita - Air Quality';
    fetchAirQuality();
  }, []);
  
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Current Air Quality</h1>
            {locationPermission !== false && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-1" />
                <span>Using your current location</span>
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
              <p>{error}</p>
              {locationPermission === false && (
                <button 
                  onClick={() => navigate('/')}
                  className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                >
                  Return to Home
                </button>
              )}
            </motion.div>
          ) : (
            airQualityData && (
              <AqiDisplay 
                aqi={airQualityData.aqi} 
                location={airQualityData.location}
                isLoading={loading}
              />
            )
          )}
          
          <motion.button
            onClick={fetchAirQuality}
            className="mt-6 flex items-center justify-center mx-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </motion.button>
          
          <motion.div 
            className="mt-8 bg-white p-4 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-lg font-medium text-gray-900 mb-3">Understanding Air Quality</h2>
            <div className="space-y-3 text-sm">
              <p className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-success-500 mr-2"></span>
                <span><strong>0-50:</strong> Good - Air quality is satisfactory</span>
              </p>
              <p className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-accent-400 mr-2"></span>
                <span><strong>51-100:</strong> Moderate - Acceptable air quality</span>
              </p>
              <p className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-warning-500 mr-2"></span>
                <span><strong>101-150:</strong> Unhealthy for sensitive groups</span>
              </p>
              <p className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-error-500 mr-2"></span>
                <span><strong>151-200:</strong> Unhealthy - Health effects for everyone</span>
              </p>
              <p className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-error-700 mr-2"></span>
                <span><strong>201-300:</strong> Very Unhealthy - Serious health effects</span>
              </p>
              <p className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-error-900 mr-2"></span>
                <span><strong>301+:</strong> Hazardous - Emergency conditions</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <BottomNavigation />
    </PageTransition>
  );
};

export default AirQualityPage;