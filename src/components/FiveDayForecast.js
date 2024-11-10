import React from "react";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import "./FiveDayForecast.css";

const weatherIcons = {
  "clear sky": <WiDaySunny />,
  "few clouds": <WiCloud />,
  "scattered clouds": <WiCloud />,
  "broken clouds": <WiCloud />,
  "shower rain": <WiRain />,
  rain: <WiRain />,
  thunderstorm: <WiThunderstorm />,
  snow: <WiSnow />,
  mist: <WiCloud />,
};

function FiveDayForecast({ forecastList, cityName }) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  const filteredForecast = forecastList
    ? forecastList.filter((entry) => entry.dt_txt.includes("12:00:00"))
    : [];

  return (
    <div className="five-day-forecast">
      <h2 className="forecast-heading text-white">
        5-Day Forecast for {cityName}
      </h2>
      <div className="forecast-grid">
        {filteredForecast.length > 0 ? (
          filteredForecast.map((day, index) => {
            const weatherCondition = day.weather[0].description;
            return (
              <div key={index} className="forecast-day">
                <h4>{formatDate(day.dt)}</h4>
                <div
                  className={`icon ${
                    weatherCondition.includes("clear sky")
                      ? "sun"
                      : weatherCondition.includes("cloud")
                      ? "cloud"
                      : weatherCondition.includes("rain")
                      ? "rain"
                      : weatherCondition.includes("snow")
                      ? "snow"
                      : weatherCondition.includes("thunderstorm")
                      ? "thunderstorm"
                      : "default"
                  }`}
                >
                  {weatherIcons[weatherCondition] || <WiDaySunny />}
                </div>
                <p>{day.weather[0].main}</p>
                <p>Temp: {day.main.temp}°C</p>
                <p>Humidity: {day.main.humidity}%</p>
              </div>
            );
          })
        ) : (
          <p>No forecast data available.</p>
        )}
      </div>
    </div>
  );
}

export default FiveDayForecast;
