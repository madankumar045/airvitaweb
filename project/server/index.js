import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// AQI History Route
app.get('/api/aqi-history', (req, res) => {
  // In a real app, this would fetch from a database
  // For this example, we'll return mock data
  const mockHistory = [
    {
      id: '1',
      aqi: 42,
      location: 'San Francisco',
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
      latitude: 37.7749,
      longitude: -122.4194
    },
    {
      id: '2',
      aqi: 67,
      location: 'San Francisco',
      timestamp: Date.now() - 1000 * 60 * 60 * 48,
      latitude: 37.7749,
      longitude: -122.4194
    },
    {
      id: '3',
      aqi: 35,
      location: 'San Francisco',
      timestamp: Date.now() - 1000 * 60 * 60 * 72,
      latitude: 37.7749,
      longitude: -122.4194
    }
  ];
  
  res.json(mockHistory);
});

// User Settings Route
app.get('/api/user-settings/:userId', (req, res) => {
  // In a real app, this would fetch from a database
  res.json({
    notifications: {
      push: true,
      email: false
    },
    voiceSettings: {
      enabled: true,
      volume: 80,
      rate: 1,
      pitch: 1
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;