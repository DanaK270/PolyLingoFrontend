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
      if (response.status === 200) {
        console.log("Language data submitted successfully!");
        navigate("/success"); // Navigate on success, or handle success feedback
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
              <h4>Videos</h4>
              {field.video && field.video.length > 0 && (
                <ul>
                  {field.video.map((videoPath, i) => (
                    <li key={i}>{videoPath}</li>
                  ))}
                </ul>
              )}
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleVideoUpload(index, e)} // Handle multiple file uploads
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
