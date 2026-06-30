import React, { useState } from 'react';
import './SearchBar.css';
import { FiMapPin, FiSearch, FiSliders } from 'react-icons/fi';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSearch) {
      onSearch({ keyword, location });
    }
  };

  return (
    <form className="search-bar-wrapper" onSubmit={handleSubmit}>
      <div className="search-field">
        <FiSearch />
        <input
          type="text"
          placeholder="Job title, skill, or keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="search-field">
        <FiMapPin />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <button type="button" className="filter-btn">
        <FiSliders />
      </button>

      <button type="submit" className="btn btn-primary search-btn">
        Search Jobs
      </button>
    </form>
  );
};

export default SearchBar;