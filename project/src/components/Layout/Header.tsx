import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Wind } from 'lucide-react';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const headerBg = transparent && !scrolled 
    ? 'bg-transparent' 
    : 'bg-white shadow-sm';
  
  const textColor = transparent && !scrolled
    ? 'text-white'
    : 'text-gray-900';
  
  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <Wind className={`h-8 w-8 ${textColor}`} />
            <span className={`ml-2 text-xl font-semibold ${textColor}`}>AirVita</span>
          </Link>
          
          <Link 
            to="/settings" 
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${transparent && !scrolled ? 'hover:bg-white/20' : ''}`}
          >
            <Settings className={`h-6 w-6 ${textColor}`} />
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;