import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3001"; // Ensure this matches your local server's base URL

const CreateLanguageForm = () => {
  const navigate = useNavigate();
  const [languageName, setLanguageName] = useState("");
  const [difficulties, setDifficulties] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([{ name: "", description: "", video: [] }]); // Initialize video as an empty array

  // Handle changes to lesson fields
  const handleFieldChange = (index, e) => {
    const { name, value } = e.target;
    const newFields = [...fields];
    newFields[index][name] = value;
    setFields(newFields);
  };

  // Add new lesson field
  const handleAddField = () => {
    setFields([...fields, { name: "", description: "", video: [] }]); // Initialize video as an empty array
  };

  // Remove lesson field
  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  // Handle video upload for a specific lesson
  const handleVideoUpload = (index, e) => {
    const files = e.target.files; // Get all selected files
    if (files.length > 0) {
      const videoPaths = Array.from(files).map((file) => `C:/videos/${file.name}`); // Get the file paths
      setFields((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields[index] = {
          ...updatedFields[index],
          video: [...updatedFields[index].video, ...videoPaths], // Add new video paths to the existing array
        };
        return updatedFields;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the language data
    const formData = {
      languagename: languageName,
      difficulties: difficulties,
      description: description,
      fields: fields.map((field) => ({
        name: field.name,
        description: field.description,
        video: field.video, // Video is now an array of paths
      })),
    };

    try {
      // Send the data to your backend API
      const response = await axios.post(`${BASE_URL}/language/languages`, formData);
      if (response.status === 201) {
        console.log("Language data submitted successfully!");
        navigate("/main"); // Navigate on success, or handle success feedback
      } else {
        console.error("Error submitting language data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="create-lang-form-container">
      <h1 className="create-lang-form-title">Create Language</h1>
      <form onSubmit={handleSubmit} className="create-lang-form">
        <div className="create-lang-form-input-group">
          <label htmlFor="languageName" className="create-lang-form-label">Language Name:</label>
          <input
            id="languageName"
            type="text"
            value={languageName}
            onChange={(e) => setLanguageName(e.target.value)}
            required
            className="create-lang-form-input"
          />
        </div>

        <div className="create-lang-form-input-group">
          <label htmlFor="difficulties" className="create-lang-form-label">Difficulties:</label>
          <input
            id="difficulties"
            type="text"
            value={difficulties}
            onChange={(e) => setDifficulties(e.target.value)}
            required
            className="create-lang-form-input"
          />
        </div>

        <div className="create-lang-form-input-group">
          <label htmlFor="description" className="create-lang-form-label">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="create-lang-form-textarea"
          />
        </div>

        <div className="create-lang-lessons-section">
          <h3 className="create-lang-lessons-title">Lessons</h3>
          {fields.map((field, index) => (
            <div key={index} className="create-lang-lesson-field">
              <input
                type="text"
                name="name"
                placeholder="Lesson Name"
                value={field.name}
                onChange={(e) => handleFieldChange(index, e)}
                required
                className="create-lang-lesson-input"
              />
              <textarea
                name="description"
                placeholder="Lesson Description"
                value={field.description}
                onChange={(e) => handleFieldChange(index, e)}
                required
                className="create-lang-lesson-input"
              />
              <div className="create-lang-video-upload">
                <h4>Videos</h4>
                {field.video.length > 0 && (
                  <ul className="create-lang-video-list">
                    {field.video.map((videoPath, i) => (
                      <li key={i} className="create-lang-video-item">{videoPath}</li>
                    ))}
                  </ul>
                )}
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleVideoUpload(index, e)}
                  className="create-lang-video-input"
                />
                <button type="button" onClick={() => handleRemoveField(index)} className="create-lang-remove-lesson-btn">
                  Remove Lesson
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddField} className="create-lang-add-lesson-btn">
            Add Lesson
          </button>
        </div>

        <button type="submit" className="create-lang-submit-btn">
          Create Language
        </button>
      </form>
    </div>
  );
};

export default CreateLanguageForm;
