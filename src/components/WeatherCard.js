import React from "react";
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
  WiCloud,
  WiDaySunny,
  WiDayRain,
  WiSnow,
  WiBarometer,
  WiDust,
  WiEarthquake,
} from "react-icons/wi";
import "animate.css";
import "./WeatherCard.css";

function WeatherComponent({
  weather,
  city,
  country,
  sunrise,
  sunset,
  timezone,
  population,
}) {
  const convertToLocalTime = (timestamp, timezoneOffset) => {
    if (!timestamp) return "N/A";
    const date = new Date(
      (timestamp + timezoneOffset) * 1000 + 5 * 60 * 60 * 1000
    );
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case "clear":
        return <WiDaySunny size={70} className="icon-bounce" />;
      case "clouds":
        return <WiCloud size={70} className="icon-fade" />;
      case "rain":
        return <WiDayRain size={70} className="icon-bounce" />;
      case "snow":
        return <WiSnow size={70} />;
      default:
        return <WiDaySunny size={70} />;
    }
  };

  const formatPopulation = (pop) => {
    if (pop >= 10000000) {
      return (pop / 10000000).toFixed(2) + " crore";
    } else if (pop >= 100000) {
      return (pop / 100000).toFixed(2) + " lakh";
    }
    return pop.toString();
  };

  if (!weather || !weather.main || !weather.weather[0]) {
    return <div className="btn btn-danger">No data found</div>;
  }

  const sunriseTime = convertToLocalTime(sunrise, timezone);
  const sunsetTime = convertToLocalTime(sunset, timezone);

  return (
    <div className="weatherContainer animate__animated animate__fadeIn">
      <div className="mainInfo">
        <h2 className="animate__animated animate__zoomIn">
          Weather in {city ? city : "Unknown City"},{" "}
          {country ? country : "Unknown Country"}
        </h2>
        <div className="temperatureSection animate__animated animate__fadeInUp">
          <WiThermometer size={100} />
          <div>
            <p className="temperatureValue">{weather.main.temp}°C</p>
            <h4>Feels Like: {weather.main.feels_like}°C</h4>
          </div>
        </div>
        <div className="weatherIcon animate__animated animate__zoomIn">
          {getWeatherIcon(weather.weather[0].main)}
          <p>
            {weather.weather[0].main} - {weather.weather[0].description}
          </p>
        </div>
      </div>
      <div className="sunInfo animate__animated animate__fadeIn">
        <div className="sunrise">
          <WiSunrise className="sunrise_data" size={60} />
          <p>Sunrise: {sunriseTime}</p>
        </div>
        <div className="sunset">
          <WiSunset className="sunrise_data" size={60} />
          <p>Sunset: {sunsetTime}</p>
        </div>
      </div>
      <div className="weatherDetailsGrid animate__animated animate__fadeInUp">
        <div className="detailItem">
          <WiHumidity size={30} />
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
        <div className="detailItem">
          <WiStrongWind size={30} />
          <p>
            Wind Speed: {weather.wind.speed} km/h, {weather.wind.deg}°
          </p>
        </div>
        <div className="detailItem">
          <WiCloud size={30} />
          <p>Cloudiness: {weather.clouds.all}%</p>
        </div>
        <div className="detailItem">
          <WiDust size={30} />
          <p>Visibility: {weather.visibility / 1000} km</p>
        </div>
        <div className="detailItem">
          <WiBarometer size={30} />
          <p>Pressure: {weather.main.pressure} hPa</p>
        </div>
        <div className="detailItem population">
          <WiEarthquake size={30} />
          <p>Population: {formatPopulation(population)}</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherComponent;
