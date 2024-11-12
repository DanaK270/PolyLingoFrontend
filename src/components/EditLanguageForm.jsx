import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:3001';

const UpdateLanguageForm = () => {
  const navigate = useNavigate();
  const { languageId } = useParams(); // Get the language ID from the URL
  const [languageName, setLanguageName] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState([{ name: '', description: '', }]);

  // Fetch existing language data
  useEffect(() => {
    const fetchLanguageData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/language/languages/${languageId}`); 
       
        const languageData = response.data;
        setLanguageName(languageData.languagename);
        setDifficulties(languageData.difficulties);
        setDescription(languageData.description);
        setLessons(languageData.fields);
      } catch (error) {
        console.error('Error fetching language data:', error);
      }
    };

    fetchLanguageData();
  }, [languageId]);

  const handleLessonChange = (index, event) => {
    const { name, value } = event.target;
    const newLessons = [...lessons];
    newLessons[index][name] = value;
    setLessons(newLessons);
  };

  const handleAddLesson = () => {
    setLessons([...lessons, { name: '', description: '', video: [] }]);
  };

  const handleRemoveLesson = (index) => {
    const newLessons = lessons.filter((_, i) => i !== index);
    setLessons(newLessons);
  };

  const handleVideoUpload = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('videos', file);
      try {
        const response = await axios.post(`${BASE_URL}/videos`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const videoUrl = response.data.videoUrl;
        const newLessons = [...lessons];
        newLessons[index].video = [...newLessons[index].video, videoUrl];
        setLessons(newLessons);
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const languageData = {
        languagename: languageName,
        difficulties,
        description,
        fields: lessons,
      };
      console.log(languageData)
      await axios.put(`${BASE_URL}/language/languages/${languageId}`, languageData);// Use PUT forupdating
      
      navigate('/main');
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  return (
    <>
      <h1 className="update-language-title">Update Language</h1>
      <form onSubmit={handleSubmit} className="update-language-form">
        <div className="update-language-field">
          <label className="update-language-label">Language Name:</label>
          <input
            type="text"
            value={languageName}
            onChange={(event) => setLanguageName(event.target.value)}
            className="update-language-input"
            required
          />
        </div>
        <div className="update-language-field">
          <label className="update-language-label">Difficulties:</label>
          <input
            type="text"
            value={difficulties}
            onChange={(event) => setDifficulties(event.target.value)}
            className="update-language-input"
            required
          />
        </div>
        <div className="update-language-field">
          <label className="update-language-label">Description:</label>
          <textarea
            value={description}
            onChange ={(event) => setDescription(event.target.value)}
            className="update-language-textarea"
            required
          />
        </div>
        {lessons.map((lesson, index) => (
          <div key={index} className="lesson-container">
            <h3>Lesson {index + 1}</h3>
            <div className="update-language-field">
              <label className="update-language-label">Lesson Name:</label>
              <input
                type="text"
                name="name"
                value={lesson.name}
                onChange={(event) => handleLessonChange(index, event)}
                className="update-language-input"
                required
              />
            </div>
            <div className="update-language-field">
              <label className="update-language-label">Lesson Description:</label>
              <textarea
                name="description"
                value={lesson.description}
                onChange={(event) => handleLessonChange(index, event)}
                className="update-language-textarea"
                required
              />
            </div>
            <div className="update-language-field">
             
            </div>
            <button type="button" onClick={() => handleRemoveLesson(index)} className="remove-lesson-button">
              Remove Lesson
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddLesson} className="add-lesson-button">
          Add Lesson
        </button>
        <button type="submit" className="update-language-submit-button">
          Update Language
        </button>
      </form>
    </>
  );
};

export default UpdateLanguageForm;