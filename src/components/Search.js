// Search.js
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../components/Search.css';

function SearchComponent({ onSearch }) {
  const [inputValue, setInputValue] = useState("");
  let navigate = useNavigate(); 

  const handleSearch = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      alert("Please enter a city name");  // Display alert if input is empty
      return;
    }
    
    try {
      await onSearch(inputValue.trim());
      navigate("/weather");
    } catch (error) {
      console.error("Error during search:", error.message);
    }
  };

  return (
    <div className="container mx-auto">
      <form className="form" onSubmit={handleSearch}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter city name"
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchComponent;
