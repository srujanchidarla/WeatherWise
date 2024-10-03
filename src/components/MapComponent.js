import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "./MapComponent.css";

const MapComponent = () => {
  const mapRef = useRef(null); // Use a ref to store the map instance

  const cities = [
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Hyderabad", lat: 17.385, lon: 78.4867 }, // Hyderabad, India
    { name: "Beijing", lat: 39.9042, lon: 116.4074 }, // Beijing, China
    { name: "Sydney", lat: -33.8688, lon: 151.2093 }, // Sydney, Australia
    { name: "Brasilia", lat: -15.8267, lon: -47.9218 }, // Brasilia, Brazil
    { name: "Ottawa", lat: 45.4215, lon: -75.6972 }, // Ottawa, Canada
    { name: "Alaska", lat: 64.2008, lon: -149.4937 }, // Alaska, USA
    { name: "Cairo", lat: 30.0444, lon: 31.2357 }, // Cairo, Egypt
  ];

  const fetchWeather = async (city) => {
    const apiKey = "4194a7eff12a6cfbc59c0fa96e300cfd"; // Replace with your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  useEffect(() => {
    if (mapRef.current === null) {
      // Initialize the map only if it's not already initialized
      mapRef.current = L.map("map").setView([20.5937, 78.9629], 2); // Center the map on India

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://carto.com/attributions">CartoDB</a>',
        }
      ).addTo(mapRef.current);

      // Fetch weather data for each city and add markers
      cities.forEach(async (city) => {
        const weather = await fetchWeather(city);
        L.marker([city.lat, city.lon])
          .addTo(mapRef.current)
          .bindPopup(
            `<b>${city.name}</b><br>Temperature: ${weather.main.temp}°C<br>Condition: ${weather.weather[0].description}`
          );
      });
    }
  }, []);

  return (
    <div id="map" style={{ height: "500px", width: "100%" }}></div> // Map container
  );
};

export default MapComponent;
