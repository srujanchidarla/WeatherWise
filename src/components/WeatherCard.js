import "./WeatherCard.css";
import clearSky from '../assets/sky.gif';
import clouds from '../assets/clouds.gif';
import rain from '../assets/rain.gif';

function WeatherComponent({ weather }) {

  function getBackgroundImage(weather) {
    switch(weather.weather[0].main.toLowerCase()) {
      case 'clear':
        return `url(${clearSky})`;
      case 'clouds':
        return `url(${clouds})`;
      case 'rain':
        return `url(${rain})`;
      default:
        return "linear-gradient(145deg, #e6e6e6, #ffffff)"; // Fallback for other conditions
    }
  }
  
  if (!weather) return <div className="btn btn-danger">No data found</div>;

  return (
    <div className="weatherContainer" style={{ backgroundImage: getBackgroundImage(weather), backgroundSize: 'cover' }}>
      <h2 className="weatherItem">
        Weather in {weather.name}, {weather.sys.country}
      </h2>
      <img
        className="weatherItem"
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
        alt={weather.weather[0].description}
      />
      <p className="weatherItem">Temperature: {weather.main.temp}°C</p>
      <p className="weatherItem">Feels Like: {weather.main.feels_like}°C</p>
      <p className="weatherItem">
        Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
      </p>
      <p className="weatherItem">
        Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
      </p>
      <p className="weatherItem">
        Condition: {weather.weather[0].main} - {weather.weather[0].description}
      </p>
      <p className="weatherItem">Humidity: {weather.main.humidity}%</p>
      <p className="weatherItem">
        Wind Speed: {weather.wind.speed} km/h, Direction: {weather.wind.deg}°
      </p>
      <p className="weatherItem">Cloudiness: {weather.clouds.all}%</p>
      <p className="weatherItem">Visibility: {weather.visibility / 1000} km</p>
      <p className="weatherItem">Pressure: {weather.main.pressure} hPa</p>
    </div>
  );
}

export default WeatherComponent;
