import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:3001';

const CreateLanguageForm = () => {
  const navigate = useNavigate();
  const [languageName, setLanguageName] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState([{ name: '', description: '', video: [] }]);

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
      await axios.post(`${BASE_URL}/languages`, languageData);
      setLanguageName('');
      setDifficulties('');
      setDescription('');
      setLessons([{ name: '', description: '', video: [] }]);
      navigate('/languages');
    } catch (error) {
      console.error('Error creating language:', error);
    }
  };

  return (
    <>
      <h1 className="newlanguage-title">New Language</h1>
      <form onSubmit={handleSubmit} className="newlanguage-form">
        <div className="newlanguage-field">
          <label className="newlanguage-label">Language Name:</label>
          <input
            type="text"
            value={languageName}
            onChange={(event) => setLanguageName(event.target.value)}
            className="newlanguage-input"
            required
          />
        </div>
        <div className="newlanguage-field">
          <label className="newlanguage-label">Difficulties:</label>
          <input
            type="text"
            value={difficulties}
            onChange={(event) => setDifficulties(event.target.value)}
            className="newlanguage-input"
            required
          />
        </div>
        <div className="newlanguage-field">
          <label className="newlanguage-label">Description:</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="newlanguage-input"
            required
          />
        </div>
        <div className="newlanguage-lessons">
          <h3>Lessons</h3>
          {lessons.map((lesson, index) => (
            <div key={index} className="newlanguage-lesson">
              <div>
                <label className="newlanguage-label">Lesson Name:</label>
                <input
                  type="text"
                  name="name"
                  value={lesson.name}
                  onChange={(event) => handleLessonChange(index, event)}
                  className="newlanguage-input"
                  required
                />
              </div>
              <div>
                <label className="newlanguage-label">Lesson Description:</label>
                <textarea
                  name="description"
                  value={lesson.description}
                  onChange={(event) => handleLessonChange(index, event)}
                  className="newlanguage-input"
                  required
                />
              </div>
              <div>
                <label className="newlanguage-label">Upload Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) => handleVideoUpload(index, event)}
                  className="newlanguage-input"
                />
                {lesson.video.length > 0 && (
                  <ul>
                    {lesson.video.map((videoUrl, vidIndex) => (
                      <li key={vidIndex}><a href={videoUrl} target="_blank" rel="noopener noreferrer">{`Video ${vidIndex + 1}`}</a></li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="button" onClick={() => handleRemoveLesson(index)}>
                Remove Lesson
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddLesson}>
            Add Lesson
          </button>
        </div>
        <button type="submit">Create Language</button>
      </form>
    </>
  );
};

export default CreateLanguageForm;
