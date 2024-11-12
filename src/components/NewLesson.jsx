import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3001"; // Ensure this matches your local server's base URL

const CreateLanguageForm = () => {
  const navigate = useNavigate();
  const [languageName, setLanguageName] = useState("");
  const [difficulties, setDifficulties] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([{ name: "", description: "", video: [] }]); // For lessons

  // Handle changes to lesson fields
  const handleFieldChange = (index, e) => {
    const { name, value } = e.target;
    const newFields = [...fields];
    newFields[index][name] = value;
    setFields(newFields);
  };

  // Add new lesson field
  const handleAddField = () => {
    setFields([...fields, { name: "", description: "", video: [] }]);
  };

  // Remove lesson field
  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  // Handle video upload for a specific lesson
  const handleVideoUpload = async (index, e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        // Create the path with hardcoded base (e.g., C:\\videos\\filename)
        const videoPath = `C:/videos/${file.name}`;

        let fieldsCopy = [...fields];
        // Ensure the video is stored as an array of strings
        fieldsCopy[index].video = [videoPath]; // Store the video as an array with the file path string
        setFields(fieldsCopy);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
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
        video: field.video, // This will be an array of video paths as strings
      })),
    };

    try {
      // Send the data to your backend API
      const response = await axios.post(`${BASE_URL}/language/languages`, formData);
      if (response.status === 200) {
        // Handle successful submission
        console.log("Language data submitted successfully!");
      } else {
        console.error("Error submitting language data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Create Language</h1>
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
          {fields.map((field, index) => (
            <div key={index}>
              <input
                type="text"
                name="name"
                placeholder="Lesson Name"
                value={field.name}
                onChange={(e) => handleFieldChange(index, e)}
                required
              />
              <textarea
                name="description"
                placeholder="Lesson Description"
                value={field.description}
                onChange={(e) => handleFieldChange(index, e)}
                required
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(index, e)}
              />
              <button type="button" onClick={() => handleRemoveField(index)}>
                Remove Lesson
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddField}>
            Add Lesson
          </button>
        </div>
        <button type="submit">Create Language</button>
      </form>
    </div>
  );
};

export default CreateLanguageForm;
