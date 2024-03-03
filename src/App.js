// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherComponent from "./components/WeatherCard";
import SearchComponent from "./components/Search";

function App() {
  <Router>
    <Routes>
      <Route path="/" element={<SearchComponent />} />
      <Route path="/weather" element={<WeatherComponent />} />
    </Routes>
  </Router>;

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false); // New state

  const apiKey = "4194a7eff12a6cfbc59c0fa96e300cfd"; // Ensure this is your valid API key

  // Correctly defined fetchWeatherByCoords within the component scope
  const fetchWeatherByCoords = async (lat, lon, isCurrent = false) => {
    setLoading(true);
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(weatherUrl);
      const data = await response.json();
      setWeatherData(data);
      setIsCurrentLocation(isCurrent);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Function to get the current location of the device
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    // Call getCurrentLocation when the component mounts
    getCurrentLocation();
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    try {
      const geoResponse = await fetch(geocodeUrl);
      const geoData = await geoResponse.json();
      if (geoData && geoData.length > 0) {
        const { lat, lon } = geoData[0];
        fetchWeatherByCoords(lat, lon);
      } else {
        console.error("City not found");
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div>
        <SearchComponent onSearch={fetchWeather} />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {isCurrentLocation && (
              <h4>This is your current location weather report</h4>
            )}
            {weatherData && <WeatherComponent weather={weatherData} />}
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
