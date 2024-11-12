import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3001";

const LanguageCard = ({ user, language, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const isAdmin = user && user.role === "admin";

  const handleShowLessons = () => {
    navigate(`/${language._id}/lessons`); // Navigate to the lessons page for this language
  };

  const handleDeleteLanguage = async () => {
    if (window.confirm("Are you sure you want to delete this language?")) {
      try {
        await axios.delete(`${BASE_URL}/languages/${language._id}`); // Ensure the endpoint is correct
        onDelete(language._id); // Call the onDelete function passed as a prop
      } catch (error) {
        console.error("Error deleting language:", error);
      }
    }
  };

  return (
    <div className="language-card">
      <h2 className="language-name">{language.languagename}</h2>
      <p className="language-description">{language.description}</p>
      <p className="language-difficulties">Difficulties: {language.difficulties}</p>

      {language.fields && language.fields.length > 0 && (
        <div className="lesson-schedule">
          <h3>Lessons:</h3>
          <ul>
            {language.fields.map((lesson, index) => (
              <li key={index}>
                <strong>{lesson.name}</strong>: {lesson.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="language-actions">
        {isAdmin && (
          <>
            <button onClick={() => onEdit(language)}>Edit</button>
            <button onClick={handleDeleteLanguage}>Delete</button>
            <button onClick={handleShowLessons}>Show Lessons</button>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageCard;