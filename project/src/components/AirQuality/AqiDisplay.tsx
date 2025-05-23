import { motion } from 'framer-motion';

interface AqiDisplayProps {
  aqi: number;
  location?: string;
  source?: string;
  isLoading?: boolean;
}

const getAqiCategory = (aqi: number): { label: string; color: string; advice: string } => {
  if (aqi <= 50) {
    return { 
      label: 'Good', 
      color: 'bg-success-500', 
      advice: 'Air quality is considered satisfactory, and air pollution poses little or no risk.' 
    };
  } else if (aqi <= 100) {
    return { 
      label: 'Moderate', 
      color: 'bg-accent-400', 
      advice: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people.' 
    };
  } else if (aqi <= 150) {
    return { 
      label: 'Unhealthy for Sensitive Groups', 
      color: 'bg-warning-500', 
      advice: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.' 
    };
  } else if (aqi <= 200) {
    return { 
      label: 'Unhealthy', 
      color: 'bg-error-500', 
      advice: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.' 
    };
  } else if (aqi <= 300) {
    return { 
      label: 'Very Unhealthy', 
      color: 'bg-error-700', 
      advice: 'Health warnings of emergency conditions. The entire population is more likely to be affected.' 
    };
  } else {
    return { 
      label: 'Hazardous', 
      color: 'bg-error-900', 
      advice: 'Health alert: everyone may experience more serious health effects.' 
    };
  }
};

const AqiDisplay: React.FC<AqiDisplayProps> = ({ 
  aqi, 
  location = 'Unknown', 
  source = 'Weather API',
  isLoading = false 
}) => {
  const { label, color, advice } = getAqiCategory(aqi);
  
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded-full w-32 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${color} h-2`}></div>
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg text-gray-600 font-medium">{location}</h2>
          <div className="flex justify-center my-4">
            <motion.div 
              className={`${color} w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {aqi}
            </motion.div>
          </div>
          <p className="text-xl font-semibold">{label}</p>
          <p className="text-sm text-gray-500 mt-1">Source: {source}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Health Advisory:</h3>
          <p className="text-sm text-gray-700">{advice}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AqiDisplay;