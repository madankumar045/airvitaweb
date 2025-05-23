import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Play, Pause, VolumeX, Volume1, Volume } from 'lucide-react';
import Header from '../../components/Layout/Header';
import BottomNavigation from '../../components/Layout/BottomNavigation';
import PageTransition from '../../components/Layout/PageTransition';

interface VoiceSettings {
  enabled: boolean;
  voice: string;
  volume: number;
  rate: number;
  pitch: number;
  autoRead: boolean;
}

const VoiceSettingsPage = () => {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    voice: 'default',
    volume: 80,
    rate: 1,
    pitch: 1,
    autoRead: false
  });
  
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'AirVita - Voice Settings';
    
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }
    
    // Get available voices
    const getVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length) {
        setVoices(availableVoices);
      }
    };
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = getVoices;
    }
    
    getVoices();
    
    // Cleanup function to stop speaking when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  
  const updateSetting = (key: keyof VoiceSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };
  
  const playTestVoice = () => {
    if (!speechSupported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(
      "Hello, I'm your AirVita assistant. I can read air quality updates for you."
    );
    
    if (settings.voice !== 'default' && voices.length) {
      const selectedVoice = voices.find(v => v.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    utterance.volume = settings.volume / 100;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };
  
  const goBack = () => {
    navigate('/settings');
  };
  
  const getVolumeIcon = () => {
    if (settings.volume === 0) return <VolumeX />;
    if (settings.volume < 50) return <Volume1 />;
    return <Volume />;
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
            <h1 className="text-2xl font-bold text-gray-900">AI Voice Settings</h1>
          </motion.div>
          
          {!speechSupported ? (
            <motion.div 
              className="bg-warning-50 border border-warning-200 text-warning-800 px-4 py-3 rounded-lg mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-medium">Speech synthesis not supported</p>
              <p className="text-sm">Your browser doesn't support the Web Speech API. Please try a different browser.</p>
            </motion.div>
          ) : (
            <>
              <motion.div 
                className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="h-5 w-5 text-primary-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Voice Assistant</h2>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => updateSetting('enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className={`p-4 space-y-6 ${!settings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice
                    </label>
                    <select
                      value={settings.voice}
                      onChange={(e) => updateSetting('voice', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                    >
                      <option value="default">Default</option>
                      {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Volume
                      </label>
                      <div className="flex items-center">
                        {getVolumeIcon()}
                        <span className="ml-1 text-sm">{settings.volume}%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.volume}
                      onChange={(e) => updateSetting('volume', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Speech Rate
                      </label>
                      <span className="text-sm">{settings.rate.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.rate}
                      onChange={(e) => updateSetting('rate', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Pitch
                      </label>
                      <span className="text-sm">{settings.pitch.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.pitch}
                      onChange={(e) => updateSetting('pitch', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                  </div>
                  
                  <button
                    onClick={isPlaying ? stopSpeech : playTestVoice}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Stop Test
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Test Voice
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Reading Options</h2>
                </div>
                
                <div className={`p-4 ${!settings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-read AQI Reports</h3>
                      <p className="text-sm text-gray-500">Automatically read air quality reports when they're loaded</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoRead}
                        onChange={(e) => updateSetting('autoRead', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
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

export default VoiceSettingsPage;