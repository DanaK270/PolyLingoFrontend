import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const LanguageDetails = () => {
  const { languageId } = useParams();
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLanguage = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/language/languages/${languageId}`);
        setLanguage(response.data);
      } catch (error) {
        console.error('Error fetching language details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguage();
  }, [languageId]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!language) return <p className="error-text">Language not found.</p>;

  return (
    <div className="language-details-container">
      <div className="language-card">
        <h3 className="language-name">{language.languagename} Details</h3>
        <p className="language-description">{language.description}</p>
        <h4 className="lessons-title">Lessons</h4>
        <ul className="lessons-list">
          {language.fields.map((lesson) => (
            <li key={lesson._id} className="lesson-item">
              <Link to={`/lessons/${lesson._id}`} className="lesson-link">
                {lesson.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageDetails;
