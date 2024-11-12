import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:3001'; // Ensure this is defined

const Main = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/language/languages`);
        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);

  const handleDelete = async (languageId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this language?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/language/languages/${languageId}`);
      setLanguages(languages.filter((language) => language._id !== languageId));
      alert("Language deleted successfully!");
    } catch (error) {
      console.error("Error deleting language:", error);
      alert("Failed to delete language. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Languages</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-stack">
          {languages.map((language) => (
            <div key={language._id} className="card">
              <div className="card-icon">🌐</div>
              <h3>{language.languagename}</h3>
              <p>{language.description}</p>
              <Link to={`/languages/${language._id}`} className="button">
                View Lessons
              </Link>
              <Link to={`/update/${language._id}`} className="button">
              Update
              </Link>
              
              <button onClick={() => handleDelete(language._id)} className="button delete-button">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Main;