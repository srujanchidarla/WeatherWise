import React from "react";
import "./FiveDayForecast.css";

function FiveDayForecast({ forecastList, cityName }) {
  // Function to format the date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  // Check if forecastList is available, and filter for one entry per day
  const filteredForecast = forecastList
    ? forecastList.filter((entry) => entry.dt_txt.includes("12:00:00"))
    : [];

  return (
    <div className="five-day-forecast">
      <h2>5-Day Forecast</h2>
      <div className="forecast-grid">
        {filteredForecast.length > 0 ? (
          filteredForecast.map((day, index) => (
            <div key={index} className="forecast-day">
              <h4>{formatDate(day.dt)}</h4>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
                className="weather-icon"
              />
              <p>{day.weather[0].main}</p>
              <p>Temp: {day.main.temp}°C</p>
              <p>Humidity: {day.main.humidity}%</p>
            </div>
          ))
        ) : (
          <p>No forecast data available.</p>
        )}
      </div>
    </div>
  );
}

export default FiveDayForecast;
