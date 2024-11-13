import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Main = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term

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

  // Filter languages based on search term
  const filteredLanguages = languages.filter(language =>
    language.languagename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    language.difficulties.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Languages</h2>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by language or difficulty..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
      <div className="card-stack">
        {filteredLanguages.map((language) => (
          <div key={language._id} className="card">
            <div className="difficulty-badge">{language.difficulties}</div>
            <div className="card-icon">🌐</div>
            <h3>{language.languagename}</h3>
            <p>{language.description}</p>
            <Link to={`/languages/${language._id}`} className="button">
              View Lessons
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Main;
