import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Main = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [searchType, setSearchType] = useState("languagename"); // State to hold the filter type

  useEffect(() => {
    const fetchLanguages = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/language/languages');
        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);

  // Filter languages based on search term and selected filter type
  const filteredLanguages = languages.filter(language => {
    const fieldToSearch = language[searchType].toLowerCase();
    return fieldToSearch.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container">
      <h2>Languages</h2>

      {/* Dropdown to choose search type */}
      <div className="search-controls">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-dropdown"
        >
          <option value="languagename">Language Name</option>
          <option value="difficulties">Difficulty</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder={`Search by ${searchType}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="card-stack">
  {filteredLanguages.length > 0 ? (
    filteredLanguages.map((language) => (
      <div key={language._id} className="card">
        <div className="difficulty-badge">{language.difficulties}</div>
        <div className="card-icon">🌐</div>
        <h3>{language.languagename}</h3>
        <p>{language.description}</p>
        <Link to={`/languages/${language._id}`} className="button">
          View Lessons
        </Link>
      </div>
    ))
  ) : (
    <p>No languages found.</p>
  )}
</div>

    </div>
  );
};

export default Main;
