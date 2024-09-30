import React from "react";
import "./FiveDayForecast.css";

function FiveDayForecast({ forecastList }) {
  // Function to format the date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
  };

  // Filter the forecast to get one entry per day (e.g., around midday)
  const filteredForecast = forecastList.filter((entry) => entry.dt_txt.includes("12:00:00"));

  return (
    <div className="five-day-forecast">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {filteredForecast.map((day, index) => (
          <div key={index} className="forecast-day">
            <h4>{formatDate(day.dt)}</h4>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            />
            <p>{day.weather[0].main}</p>
            <p>Temp: {day.main.temp}°C</p>
            <p>Humidity: {day.main.humidity}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FiveDayForecast;
