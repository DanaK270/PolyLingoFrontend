import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "http://localhost:3001";

const EditLanguageForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = location.state;

  // Initialize state with language data
  const [languageName, setLanguageName] = useState(language.languagename);
  const [difficulties, setDifficulties] = useState(language.difficulties);
  const [description, setDescription] = useState(language.description);
  const [lessons, setLessons] = useState(language.fields || []); // Initialize with current lessons
  const [loading, setLoading] = useState(true);

  const handleLessonChange = (index, event) => {
    const { name, value } = event.target;
    const newLessons = [...lessons];
    newLessons[index][name] = value;
    setLessons(newLessons);
  };

  const handleAddLesson = () => {
    setLessons([...lessons, { name: '', description: '', video: '' }]);
  };

  const handleRemoveLesson = (index) => {
    const newLessons = lessons.filter((_, i) => i !== index);
    setLessons(newLessons);
  };

  const handleVideoUpload = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file); // Use 'file' as the field name for Cloudinary
      formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

      try {
        // Step 1: Upload video to Cloudinary
        const response = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/video/upload', formData);
        
        const videoUrl = response.data.secure_url; // Get the video URL from the response
        const newLessons = [...lessons];
        newLessons[index].video = videoUrl; // Set the video URL in the correct field
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
      await axios.put(`${BASE_URL}/languages/${language._id}`, languageData); // Adjust the endpoint as necessary
      navigate("/languages"); // Redirect to the languages list or appropriate route
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  useEffect(() => {
    // Optionally fetch additional data here if needed
    setLoading(false);
  }, []);

  return (
    <>
      <div>
        <h1>Edit Language</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
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
            <div>
              <h3>Lessons</h3>
              {lessons.map((lesson, index) => (
                <div key={index}>
                  <div>
                    <label>Lesson Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={lesson.name}
                      onChange={(event) => handleLessonChange(index, event)}
                      required
                    />
                  </div>
                  <div>
                    <label>Lesson Description:</label>
                    <textarea
                      name="description"
                      value={lesson.description}
                      on Change={(event) => handleLessonChange(index, event)}
                      required
                    />
                  </div>
                  <div>
                    <label>Upload Video:</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(event) => handleVideoUpload(index, event)}
                    />
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
            <button type="submit">Update Language</button>
          </form>
        )}
      </div>
    </>
  );
};

export default EditLanguageForm;