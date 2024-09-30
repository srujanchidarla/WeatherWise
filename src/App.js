import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherComponent from "./components/WeatherCard";
import SearchComponent from "./components/Search";
import FiveDayForecast from "./components/FiveDayForecast";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false); // For current location check
  const [error, setError] = useState(null); // Error state
  const [currentCity, setCurrentCity] = useState(""); // For storing current city name
  const [currentCountry, setCurrentCountry] = useState(""); // For storing current country name

  const apiKey = "4194a7eff12a6cfbc59c0fa96e300cfd"; // Replace with your valid API key

  // Fetch weather data using latitude and longitude
  const fetchWeatherByCoords = async (lat, lon, isCurrent = false) => {
    setLoading(true);
    setError(null); // Reset previous errors
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(weatherUrl);
      const data = await response.json();

      if (data.cod && data.cod !== "200") {
        throw new Error(data.message);
      }

      setWeatherData(data);
      setIsCurrentLocation(isCurrent); // Mark the weather data as for current location
      setCurrentCity(data.city.name); // Store the current city
      setCurrentCountry(data.city.country); // Store the current country
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      setError("Unable to retrieve weather data.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect for getting the current location of the device
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude,
              true
            ); // Fetch weather using current location
          },
          (error) => {
            console.error("Geolocation error:", error);
            setError("Unable to retrieve your location.");
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setError("Geolocation is not supported by this browser.");
      }
    };

    // Call getCurrentLocation when the component mounts
    getCurrentLocation();
  }, []);

  // Fetch weather based on the city name (via geocode API)
  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null); // Reset previous errors
    const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    try {
      const geoResponse = await fetch(geocodeUrl);
      const geoData = await geoResponse.json();

      if (geoData && geoData.length > 0) {
        const { lat, lon } = geoData[0]; // Get latitude and longitude
        await fetchWeatherByCoords(lat, lon);
      } else {
        setError("City not found. Please try another search.");
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error.message);
      setError("Error fetching data. Please try again.");
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
        ) : error ? (
          <div style={{ color: "red", marginTop: "20px" }}>{error}</div>
        ) : (
          <>
            {isCurrentLocation && (
              <h4 className="btn btn-danger">
                This is your current location weather report: {currentCity},{" "}
                {currentCountry}
              </h4>
            )}
            {weatherData && weatherData.list && (
              <>
                <WeatherComponent
                  weather={weatherData.list[0]}
                  city={currentCity}
                  country={currentCountry}
                />
                <FiveDayForecast forecastList={weatherData.list} />
              </>
            )}
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
