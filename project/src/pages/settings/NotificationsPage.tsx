import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Smartphone, Mail, AlertCircle } from 'lucide-react';
import Header from '../../components/Layout/Header';
import BottomNavigation from '../../components/Layout/BottomNavigation';
import PageTransition from '../../components/Layout/PageTransition';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const NotificationsPage = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Receive alerts directly on your device',
      enabled: true
    },
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Get updates sent to your email address',
      enabled: false
    },
    {
      id: 'aqi_alerts',
      title: 'AQI Alerts',
      description: 'Be notified when air quality becomes unhealthy',
      enabled: true
    },
    {
      id: 'device_alerts',
      title: 'Device Alerts',
      description: 'Get notified about device battery and issues',
      enabled: true
    },
    {
      id: 'updates',
      title: 'App Updates',
      description: 'Learn about new features and improvements',
      enabled: false
    }
  ]);
  
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'AirVita - Notification Preferences';
    
    // Check notification permission status
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);
  
  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };
  
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
          </motion.div>
          
          {permissionStatus === 'denied' && (
            <motion.div 
              className="bg-warning-50 border border-warning-200 text-warning-800 px-4 py-3 rounded-lg mb-6 flex items-start"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Notifications are blocked</p>
                <p className="text-sm">Please enable notifications in your browser settings to receive alerts.</p>
              </div>
            </motion.div>
          )}
          
          {permissionStatus === 'default' && (
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <Bell className="h-8 w-8 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Enable Notifications</h3>
                  <p className="text-sm text-gray-500">Get important alerts about air quality and your device.</p>
                </div>
              </div>
              <button 
                onClick={requestNotificationPermission}
                className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Enable Notifications
              </button>
            </motion.div>
          )}
          
          <motion.div 
            className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Notification Channels</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive alerts directly on your device</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.find(s => s.id === 'push')?.enabled}
                    onChange={() => toggleSetting('push')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Get updates sent to your email address</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.find(s => s.id === 'email')?.enabled}
                    onChange={() => toggleSetting('email')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Alert Types</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {settings.filter(s => s.id !== 'push' && s.id !== 'email').map((setting) => (
                <div key={setting.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{setting.title}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.enabled}
                      onChange={() => toggleSetting(setting.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      <BottomNavigation />
    </PageTransition>
  );
};

export default NotificationsPage;