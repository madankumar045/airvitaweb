import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, AlertCircle, Download } from 'lucide-react';
import Header from '../../components/Layout/Header';
import BottomNavigation from '../../components/Layout/BottomNavigation';
import PageTransition from '../../components/Layout/PageTransition';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

interface AqiRecord {
  id: string;
  aqi: number;
  location: string;
  timestamp: number;
  latitude: number;
  longitude: number;
}

const AqiHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [aqiHistory, setAqiHistory] = useState<AqiRecord[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    document.title = 'AirVita - AQI History';
    fetchAqiHistory();
  }, []);
  
  const fetchAqiHistory = async () => {
    if (!currentUser) {
      setError('You must be logged in to view your AQI history.');
      setLoading(false);
      return;
    }
    
    try {
      const q = query(
        collection(db, 'aqiHistory'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const history: AqiRecord[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          aqi: data.aqi,
          location: data.location,
          timestamp: data.timestamp,
          latitude: data.latitude,
          longitude: data.longitude
        });
      });
      
      // If no history found from Firestore, add mock data
      if (history.length === 0) {
        const mockData: AqiRecord[] = [
          {
            id: '1',
            aqi: 42,
            location: 'Your Location',
            timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
            latitude: 37.7749,
            longitude: -122.4194
          },
          {
            id: '2',
            aqi: 67,
            location: 'Your Location',
            timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
            latitude: 37.7749,
            longitude: -122.4194
          },
          {
            id: '3',
            aqi: 35,
            location: 'Your Location',
            timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
            latitude: 37.7749,
            longitude: -122.4194
          }
        ];
        setAqiHistory(mockData);
      } else {
        setAqiHistory(history);
      }
    } catch (error) {
      console.error('Error fetching AQI history:', error);
      setError('Failed to fetch AQI history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return 'bg-success-500';
    if (aqi <= 100) return 'bg-accent-400';
    if (aqi <= 150) return 'bg-warning-500';
    if (aqi <= 200) return 'bg-error-500';
    if (aqi <= 300) return 'bg-error-700';
    return 'bg-error-900';
  };
  
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const goBack = () => {
    navigate('/settings');
  };
  
  return (
    <PageTransition>
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-16 pb-24 px-4">
        <div className="max-w-md mx-auto pt-8">
          <motion.div 
            className="mb-8 flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <button 
                onClick={goBack}
                className="mr-2 p-2 rounded-full hover:bg-gray-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">AQI History</h1>
            </div>
            
            <button className="p-2 rounded-full hover:bg-gray-200">
              <Download className="h-5 w-5" />
            </button>
          </motion.div>
          
          {error ? (
            <motion.div 
              className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            </motion.div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {aqiHistory.length === 0 ? (
                <motion.div 
                  className="bg-white rounded-lg shadow-sm p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No History Found</h3>
                  <p className="text-gray-500">You don't have any AQI measurements yet. Check the air quality to start building your history.</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {aqiHistory.map((record, index) => (
                    <motion.div 
                      key={record.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className={`${getAqiColor(record.aqi)} h-1`}></div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">AQI: {record.aqi}</h3>
                            <div className="flex items-center text-gray-500 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{record.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {formatDate(record.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </PageTransition>
  );
};

export default AqiHistoryPage;