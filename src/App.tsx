import { useState, useEffect } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  MapPin, 
  Music, 
  Play,
  RefreshCw,
  Moon
} from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Simple music database
  const musicDatabase: { [key: string]: Track[] } = {
    clear: [
      { id: 1, title: "Sunny Day", artist: "Happy Vibes", duration: "3:24" },
      { id: 2, title: "Golden Hour", artist: "Bright Sounds", duration: "4:12" },
      { id: 3, title: "Summer Breeze", artist: "Chill Wave", duration: "3:45" }
    ],
    rain: [
      { id: 4, title: "Rainy Mood", artist: "Cozy Cafe", duration: "4:21" },
      { id: 5, title: "Coffee & Rain", artist: "Lo-Fi Beats", duration: "3:55" },
      { id: 6, title: "Gentle Drops", artist: "Calm Sounds", duration: "5:10" }
    ],
    clouds: [
      { id: 7, title: "Cloudy Thoughts", artist: "Dreamy Pop", duration: "3:56" },
      { id: 8, title: "Grey Skies", artist: "Indie Folk", duration: "4:28" },
      { id: 9, title: "Overcast", artist: "Mellow Tunes", duration: "3:41" }
    ],
    snow: [
      { id: 10, title: "Winter Dreams", artist: "Peaceful Piano", duration: "4:55" },
      { id: 11, title: "Snowfall", artist: "Ambient Sounds", duration: "5:33" },
      { id: 12, title: "Cozy Fireplace", artist: "Warm Melodies", duration: "4:18" }
    ],
    thunderstorm: [
      { id: 13, title: "Storm Energy", artist: "Electric Beats", duration: "3:45" },
      { id: 14, title: "Thunder Roll", artist: "Power Rock", duration: "4:33" },
      { id: 15, title: "Lightning", artist: "Dynamic Sound", duration: "3:58" }
    ]
  };

  const getWeatherIcon = (condition: string) => {
    const iconClass = "w-8 h-8";
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className={iconClass} />;
      case 'rain':
        return <CloudRain className={iconClass} />;
      case 'snow':
        return <CloudSnow className={iconClass} />;
      case 'thunderstorm':
        return <Zap className={iconClass} />;
      default:
        return <Cloud className={iconClass} />;
    }
  };

  const getWeatherColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return darkMode ? 'from-yellow-600 to-orange-700' : 'from-yellow-400 to-orange-500';
      case 'rain':
        return darkMode ? 'from-blue-600 to-gray-700' : 'from-blue-400 to-gray-500';
      case 'snow':
        return darkMode ? 'from-blue-500 to-indigo-700' : 'from-blue-200 to-blue-400';
      case 'thunderstorm':
        return darkMode ? 'from-purple-700 to-gray-800' : 'from-purple-500 to-gray-600';
      default:
        return darkMode ? 'from-gray-600 to-gray-800' : 'from-gray-300 to-gray-500';
    }
  };

  const generatePlaylist = (weatherCondition: string) => {
    const condition = weatherCondition.toLowerCase();
    let tracks: Track[] = [];
    
    if (musicDatabase[condition]) {
      tracks = musicDatabase[condition];
    } else if (condition.includes('cloud')) {
      tracks = musicDatabase.clouds;
    } else {
      tracks = musicDatabase.clear;
    }
    
    setPlaylist(tracks);
  };

  const fetchWeather = async () => {
    setLoading(true);
    
    try {
      // Simulate weather API
      const conditions = ["clear", "rain", "clouds", "snow", "thunderstorm"];
      const locations = ["New York", "London", "Tokyo", "Paris", "Sydney"];
      
      const mockWeatherData: WeatherData = {
        location: locations[Math.floor(Math.random() * locations.length)],
        temperature: Math.floor(Math.random() * 35) - 5,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        description: "Current weather"
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWeather(mockWeatherData);
      generatePlaylist(mockWeatherData.condition);
    } catch (error) {
      console.error('Weather fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">WeatherBeats</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={fetchWeather}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg">Getting weather data...</p>
          </div>
        )}

        {weather && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weather Card */}
            <div className="lg:col-span-1">
              <div className={`bg-gradient-to-br ${getWeatherColor(weather.condition)} rounded-2xl p-6 text-white shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{weather.location}</span>
                  </div>
                  {getWeatherIcon(weather.condition)}
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{weather.temperature}°C</div>
                  <div className="text-lg capitalize">{weather.description}</div>
                </div>
              </div>
            </div>

            {/* Music Recommendations */}
            <div className="lg:col-span-2">
              <div className={`${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-2xl shadow-lg p-6 border transition-colors duration-300`}>
                <h2 className="text-xl font-bold mb-4">
                  Perfect for {weather.condition} weather
                </h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                  {playlist.length} tracks curated for your mood
                </p>

                <div className="space-y-3">
                  {playlist.map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{track.title}</h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {track.artist}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {track.duration}
                        </span>
                        <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How it Works */}
        <div className={`mt-12 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-2xl shadow-lg p-8 border transition-colors duration-300`}>
          <h3 className="text-2xl font-bold text-center mb-8">How WeatherBeats Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                darkMode ? 'bg-blue-600' : 'bg-blue-100'
              }`}>
                <MapPin className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-blue-500'}`} />
              </div>
              <h4 className="font-bold text-lg mb-2">Detect Location</h4>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get your current location and weather conditions
              </p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                darkMode ? 'bg-green-600' : 'bg-green-100'
              }`}>
                <Cloud className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-green-500'}`} />
              </div>
              <h4 className="font-bold text-lg mb-2">Analyze Weather</h4>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Process weather data to understand the mood
              </p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                darkMode ? 'bg-purple-600' : 'bg-purple-100'
              }`}>
                <Music className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-purple-500'}`} />
              </div>
              <h4 className="font-bold text-lg mb-2">Curate Music</h4>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Generate perfect playlist for your weather
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
