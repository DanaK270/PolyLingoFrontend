import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:3001';

const UpdateLanguageForm = () => {
  const navigate = useNavigate();
  const { languageId } = useParams();
  const [languageName, setLanguageName] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState([{ name: '', description: '' }]);
  const [loading, setLoading] = useState(true);

  // Fetch existing language data
  useEffect(() => {
    const fetchLanguageData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/language/languages/${languageId}`);
        console.log(response.data); // Log the response data
        const languageData = response.data;
        setLanguageName(languageData.languagename);
        setDifficulties(languageData.difficulties);
        setDescription(languageData.description);
        setLessons(languageData.fields);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching language data:', error);
        setLoading(false); // Set loading to false even in case of error
      }
    };
    fetchLanguageData();
  }, [languageId]);

  if (loading) {
    return <div>Loading...</div>;
  }

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const languageData = {
        languagename: languageName,
        difficulties,
        description,
        fields: lessons,
      };
      console.log(languageData);
      await axios.put(`${BASE_URL}/language/languages/${languageId}`, languageData);
      navigate('/main');
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  return (
    <>
      <h1>Update Language</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Language Name:</label>
          <input
            type="text"
            value={languageName}
            onChange={(e) => setLanguageName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Difficulties:</label>
          <input
            type="text"
            value={difficulties}
            onChange={(e) => setDifficulties(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {lessons.map((lesson, index) => (
          <div key={index}>
            <h3>Lesson {index + 1}</h3>
            <div>
              <label>Lesson Name:</label>
              <input
                type="text"
                name="name"
                value={lesson.name}
                onChange={(e) => handleLessonChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Lesson Description:</label>
              <textarea
                name="description"
                value={lesson.description}
                onChange={(e) => handleLessonChange(index, e)}
                required
              />
            </div>
            <button type="button" onClick={() => handleRemoveLesson(index)}>Remove Lesson</button>
          </div>
        ))}
        <button type="button" onClick={handleAddLesson}>Add Lesson</button>
        <button type="submit">Update Language</button>
      </form>
    </>
  );
};

export default UpdateLanguageForm;
