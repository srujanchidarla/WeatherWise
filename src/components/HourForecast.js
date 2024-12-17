import React from "react";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiShowers,
} from "react-icons/wi";
import "./HourForecast.css";

const weatherIcons = {
  "clear sky": <WiDaySunny />,
  "few clouds": <WiCloud />,
  "scattered clouds": <WiCloud />,
  "broken clouds": <WiCloud />,
  "shower rain": <WiRain />,
  rain: <WiRain />,
  "light rain": <WiShowers />,
  thunderstorm: <WiThunderstorm />,
  snow: <WiSnow />,
  mist: <WiCloud />,
};

const HourForecast = ({ forecastData }) => {
  return (
    <div className="hour-forecast">
      <h2 className="forecast-heading">Hourly Forecast</h2>
      <div className="forecast-grid">
        {forecastData.map((hour, index) => {
          const date = new Date(hour.time);
          const dayLabel = date.toLocaleDateString([], { weekday: "long" });
          const timeLabel = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={index} className="forecast-item">
              <p className="day">{dayLabel}</p>
              <p className="time">{timeLabel}</p>
              <div className="icon">
                {weatherIcons[hour.condition] || <WiDaySunny />}
              </div>
              <p className="temp">{hour.temperature.toFixed(1)}°C</p>
              <p className="condition">{hour.condition}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourForecast;
