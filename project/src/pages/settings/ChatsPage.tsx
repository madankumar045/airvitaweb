import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, User, Clock } from 'lucide-react';
import Header from '../../components/Layout/Header';
import BottomNavigation from '../../components/Layout/BottomNavigation';
import PageTransition from '../../components/Layout/PageTransition';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: number;
}

const ChatsPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'AirVita - Chats';
    
    // Mock conversation
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Hello! How can I help you with your AirVita device today?',
        sender: 'support',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 3
      },
      {
        id: '2',
        text: 'Hi, I\'m having trouble connecting my device to the app.',
        sender: 'user',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 2
      },
      {
        id: '3',
        text: 'I\'m sorry to hear that. Can you tell me what happens when you try to connect?',
        sender: 'support',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 1
      },
      {
        id: '4',
        text: 'The app searches for the device but can\'t seem to find it, even though it\'s turned on and in pairing mode.',
        sender: 'user',
        timestamp: Date.now() - 1000 * 60 * 60 * 24
      },
      {
        id: '5',
        text: 'Let\'s try a few troubleshooting steps. First, make sure your device is charged and the Bluetooth on your phone is enabled. Then, try restarting both your device and phone. Does that help?',
        sender: 'support',
        timestamp: Date.now() - 1000 * 60 * 60 * 23
      }
    ];
    
    setMessages(mockMessages);
  }, []);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: Date.now()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Our support team will get back to you soon.',
        sender: 'support',
        timestamp: Date.now()
      };
      
      setMessages((prevMessages) => [...prevMessages, supportMessage]);
    }, 1000);
  };
  
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const goBack = () => {
    navigate('/settings');
  };
  
  const renderMessages = () => {
    let currentDate = '';
    
    return messages.map((message, index) => {
      const messageDate = formatDate(message.timestamp);
      const showDateDivider = messageDate !== currentDate;
      
      if (showDateDivider) {
        currentDate = messageDate;
      }
      
      return (
        <div key={message.id}>
          {showDateDivider && (
            <div className="flex justify-center my-4">
              <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
                {messageDate}
              </div>
            </div>
          )}
          
          <motion.div 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {message.sender === 'support' && (
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 flex-shrink-0">
                <User className="h-4 w-4 text-primary-600" />
              </div>
            )}
            
            <div 
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <div 
                className={`text-xs mt-1 flex items-center ${
                  message.sender === 'user' ? 'text-primary-200' : 'text-gray-500'
                }`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(message.timestamp)}
              </div>
            </div>
            
            {message.sender === 'user' && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </motion.div>
        </div>
      );
    });
  };
  
  return (
    <PageTransition>
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-16 pb-24">
        <div className="h-full flex flex-col">
          <motion.div 
            className="px-4 py-3 border-b border-gray-200 bg-white flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              onClick={goBack}
              className="mr-2 p-2 rounded-full hover:bg-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold text-gray-900">AirVita Support</h1>
              <p className="text-xs text-gray-500">Online - Typically replies in a few hours</p>
            </div>
          </motion.div>
          
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            {renderMessages()}
          </div>
          
          <motion.div 
            className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                className="bg-primary-600 text-white rounded-r-lg px-4 py-2 focus:outline-none hover:bg-primary-700"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <BottomNavigation />
    </PageTransition>
  );
};

export default ChatsPage;