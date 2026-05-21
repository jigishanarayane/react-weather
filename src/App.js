import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = '42c678b8240f1357d274795fdf4fbb4d';

  async function getWeather() {
    if (city.trim() === '') return;
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
      } else {
        setError('City not found. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  }

  function getBackground() {
    if (!weather) return 'linear-gradient(135deg, #1a1a2e, #16213e)';
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes('rain')) return 'linear-gradient(135deg, #1a1a2e, #0a3d62)';
    if (condition.includes('cloud')) return 'linear-gradient(135deg, #2c3e50, #4a6741)';
    if (condition.includes('clear')) return 'linear-gradient(135deg, #f46b45, #eea849)';
    if (condition.includes('snow')) return 'linear-gradient(135deg, #a8c0ff, #3f2b96)';
    return 'linear-gradient(135deg, #1a1a2e, #16213e)';
  }

  return (
    <div className="app" style={{ background: getBackground() }}>
      <div className="container">
        <h1>🌤 Weather App</h1>

        <div className="search-box">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && getWeather()}
            placeholder="Enter city name..."
          />
          <button onClick={getWeather}>Search</button>
        </div>

        {loading && <div className="loading"><div className="spinner"></div></div>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <div className="temp-box">
              <h1>{Math.round(weather.main.temp)}°C</h1>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            </div>
            <p className="description">{weather.weather[0].description}</p>
            <div className="details">
              <div className="detail">
                <span className="label">Humidity</span>
                <span>{weather.main.humidity}%</span>
              </div>
              <div className="detail">
                <span className="label">Wind</span>
                <span>{Math.round(weather.wind.speed * 3.6)} km/h</span>
              </div>
              <div className="detail">
                <span className="label">Feels Like</span>
                <span>{Math.round(weather.main.feels_like)}°C</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;