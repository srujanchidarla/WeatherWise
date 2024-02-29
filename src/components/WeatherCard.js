import React, { useState, useEffect } from 'react';
import './WeatherCard.css';

function WeatherComponent() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBackgroundImage = (weather) => {
    switch(weather.weather[0].main.toLowerCase()) {
      case 'clear':
        return <img src='C:\Frontend\my-weather-app\src\assets\sky.jpg' alt='Clear Sky' ></img>
      case 'clouds':
        return <img src='C:\Frontend\my-weather-app\src\assets\cloud.jpg' alt='Clouds' ></img>
      case 'rain':
        return <img src='C:\Frontend\my-weather-app\src\assets\rain.jpg' alt='Raining' ></img>
      default:
        return 'url(/path/to/default.jpg)';
    }
  };

  useEffect(() => {
    const apiKey = '4194a7eff12a6cfbc59c0fa96e300cfd'; // Ensure this is valid and active
    const lat = '39.290386'; // Example: New York City latitude
    const lon = '-76.612190'; // Example: New York City longitude
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.toString());
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error}</div>;
  if (!weather) return <div>No data found</div>;

  return (
    <div className="weatherContainer" style={{ backgroundImage: getBackgroundImage(weather) }}>
      <h2>Weather in {weather.name}, {weather.sys.country}</h2>
      <img className="weatherImage" src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
      <div className='main'>
      <span className="weatherItem" >Temperature: {weather.main.temp}°C</span>
      <span className="weatherItem">Feels Like: {weather.main.feels_like}°C</span>
      </div>
      <div className='main'>
      <span className="weatherItem">Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</span>
      <span className="weatherItem">Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</span>
      </div>
      <div className='main'>
      <p className="weatherItem">Condition: {weather.weather[0].main} - {weather.weather[0].description}</p>
      <p className="weatherItem">Humidity: {weather.main.humidity}%</p>
      <span className="weatherItem">Wind Speed: {weather.wind.speed} km/h, Direction: {weather.wind.deg}°</span>
      <span className="weatherItem">Cloudiness: {weather.clouds.all}%</span>
      <span className="weatherItem">Visibility: {weather.visibility / 1000} km</span>
      <span className="weatherItem">Pressure: {weather.main.pressure} hPa</span>
      </div>
      
    </div>
  );
}

export default WeatherComponent;
