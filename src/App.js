import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import WeatherComponent from "./components/WeatherCard";
import SearchComponent from "./components/Search";
import FiveDayForecast from "./components/FiveDayForecast";
import HourForecast from "./components/HourForecast";
import MapComponent from "./components/MapComponent";
import Contact from "./components/Contact";
import axios from "axios";
import Footer from "./components/Footer";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [population, setPopulation] = useState(null);
  const [units, setUnits] = useState("metric"); // Toggle between metric and imperial
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const toggleUnits = () => {
    setUnits((prevUnits) => (prevUnits === "metric" ? "imperial" : "metric"));
  };

  // Memoized fetchWeatherByCoords function
  const fetchWeatherByCoords = useCallback(
    async (lat, lon, isCurrent = false) => {
      setLoading(true);
      setError(null);
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
        const response = await axios.get(weatherUrl);
        if (response.status === 200) {
          const data = response.data;
          console.log("Weather data:", data);
          setWeatherData(data);
          setIsCurrentLocation(isCurrent);
          setCurrentCity(data.city.name);
          setCurrentCountry(data.city.country);
          setPopulation(data.city.population);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
        setError("Unable to retrieve weather data.");
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, units]
  ); // Include `units` in dependencies

  // Updated useEffect with memoized fetchWeatherByCoords
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude,
              true
            );
          },
          (error) => {
            console.error("Geolocation error:", error);
            setError("Unable to retrieve your location.");
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };
    getCurrentLocation();
  }, [fetchWeatherByCoords]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    try {
      const geoResponse = await axios.get(geocodeUrl);
      const geoData = geoResponse.data;
      if (geoData && geoData.length > 0) {
        const { lat, lon } = geoData[0];
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

  const hourlyForecastData = weatherData
    ? weatherData.list.map((item) => ({
        time: item.dt * 1000 * 2, // Storing as timestamp
        temperature: item.main.temp,
        condition: item.weather[0].description.toLowerCase(), // Ensure lowercase for consistent matching
      }))
    : [];

  return (
    <>
      <Router>
        <div className="main">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SearchComponent onSearch={fetchWeather} />
                  {loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div style={{ color: "red" }}>{error}</div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-center align-items-center my-4">
                        {isCurrentLocation && (
                          <button className="btn btn-success px-4 m-1">
                            This is your current location weather report:{" "}
                            {currentCity}, {currentCountry}
                          </button>
                        )}
                      </div>
                      {weatherData && weatherData.list && (
                        <>
                          <WeatherComponent
                            weather={weatherData.list[0]}
                            city={currentCity}
                            country={currentCountry}
                            sunrise={weatherData.city.sunrise}
                            sunset={weatherData.city.sunset}
                            timezone={weatherData.city.timezone}
                            population={population}
                            units={units} // Pass units
                            toggleUnits={toggleUnits} // Pass toggleUnits
                          />
                          <HourForecast
                            forecastData={hourlyForecastData}
                            cityName={currentCity}
                          />
                          <FiveDayForecast
                            forecastList={weatherData.list}
                            cityName={currentCity}
                          />
                          <MapComponent />
                        </>
                      )}
                    </>
                  )}
                </>
              }
            />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </>
  );
}

export default App;
