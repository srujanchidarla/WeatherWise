import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import ReactDOMServer from "react-dom/server";
import "./MapComponent.css";

const MapComponent = () => {
  const mapRef = useRef(null);
  const markerLayer = useRef(null);
  const weatherCache = useRef({});
  const cities = [
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Brasilia", lat: -15.8267, lon: -47.9218 },
    { name: "Bumba", lat: 2.1883, lon: 22.4683 },
    { name: "Erdenet", lat: 49.0526, lon: 104.0442 },
    { name: "Murmansk", lat: 68.9585, lon: 33.0827 },
  ];

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <WiDaySunny size={40} color="gold" />; // Increased size
      case "clouds":
        return <WiCloud size={40} color="gray" />; // Increased size
      case "rain":
        return <WiRain size={40} color="blue" />; // Increased size
      case "snow":
        return <WiSnow size={40} color="lightblue" />; // Increased size
      case "thunderstorm":
        return <WiThunderstorm size={40} color="purple" />; // Increased size
      default:
        return <WiDaySunny size={40} color="gold" />; // Increased size
    }
  };

  const fetchWeather = async (city) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    if (weatherCache.current[city.name]) {
      return weatherCache.current[city.name];
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      weatherCache.current[city.name] = response.data;
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      return null;
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [20.5937, 78.9629],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://carto.com/attributions">CartoDB</a>',
        }
      ).addTo(mapRef.current);
      markerLayer.current = L.layerGroup().addTo(mapRef.current);
      const fetchAllCitiesWeather = async () => {
        for (const city of cities) {
          const weather = await fetchWeather(city);
          if (weather) {
            const condition = weather.weather[0].main;
            const iconMarkup = ReactDOMServer.renderToString(
              getWeatherIcon(condition)
            );
            const marker = L.divIcon({
              html: iconMarkup,
              className: "custom-icon",
            });
            L.marker([city.lat, city.lon], { icon: marker })
              .addTo(markerLayer.current)
              .bindPopup(
                `<b>${city.name}</b><br>Temperature: ${weather.main.temp}°C<br>Condition: ${weather.weather[0].description}`
              );
          }
        }
      };
      fetchAllCitiesWeather();
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="page-wrapper">
      <div className="map-page-header">
        <h1>Global Weather Map</h1>
      </div>
      <div className="map-section">
        <div className="map-container">
          <div id="map" className="map"></div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
