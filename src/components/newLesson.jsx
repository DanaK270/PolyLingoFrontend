import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const BASE_URL = "http://localhost:3001" // Ensure this matches your local server's base URL

const CreateLanguageForm = () => {
  const navigate = useNavigate()
  const [languageName, setLanguageName] = useState("")
  const [difficulties, setDifficulties] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState([
    { name: "", description: "", video: null },
  ]) // For lessons

  // Handle changes to lesson fields
  const handleFieldChange = (index, e) => {
    const { name, value } = e.target
    const newFields = [...fields]
    newFields[index][name] = value
    setFields(newFields)
  }

  // Add new lesson field
  const handleAddField = () => {
    setFields([...fields, { name: "", description: "", video: null }])
  }

  // Remove lesson field
  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
  }

  // Handle video upload for a specific lesson
  // const handleVideoUpload = async (index, e) => {
  //   // const file = e.target.files[0]
  //   // if (file) {
  //   //   const formData = new FormData()
  //   //   formData.append("file", file) // Use 'file' as the field name for Cloudinary
  //   //   formData.append("upload_preset", "videosuploads") // Replace with your Cloudinary upload preset

  //   try {
  //     // Step 1: Upload video to Cloudinary
  //     // const response = await axios.post(
  //     //   "https://api.cloudinary.com/v1_1/dtjgtwrtk/video/upload",
  //     //   formData
  //     // )

  //     // const videoUrl = response.data.secure_url // Get the URL of the uploaded video
  //     // const newFields = [...fields]
  //     // newFields[index].video = videoUrl // Set the video URL for the field
  //     // setFields(newFields) // Update state
  //     console.log(e.target.files)
  //     let fieldsCopy = [...fields]
  //     fieldsCopy[index].video = [URL.createObjectURL(e.target.files[0])]
  //     setFields(fieldsCopy)
  //   } catch (error) {
  //     console.error("Error uploading video:", error)
  //   }
  // }

  // const handleVideoUpload = (index, e) => {
  //   const file = e.target.files[0]
  //   if (file) {
  //     const newFields = [...fields]
  //     newFields[index].video = file // Store the actual file instead of blob URL
  //     setFields(newFields)
  //   }
  // }

  const handleVideoUpload = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      const newFields = [...fields]
      newFields[index].video = file // Store the actual file instead of blob URL
      setFields(newFields)
    }
  }

  // Handle form submission
  // const handleSubmit = async (e) => {
  //     e.preventDefault()

  //     // Prepare the data for submission
  //     const languageData = {
  //       languagename: languageName,
  //       difficulties,
  //       description,
  //       fields,
  //     }

  //     try {
  //       // Send the language data to the backend
  //       await axios.post(`${BASE_URL}/language/languages`, languageData)
  //       navigate("/languages") // Redirect to the languages list after successful submission
  //     } catch (error) {
  //       console.error("Error creating language:", error)
  //     }
  //   }
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Create a FormData object to hold the data
  //   const formData = new FormData();

  //   // Append language data
  //   formData.append("languagename", languageName);
  //   formData.append("difficulties", difficulties);
  //   formData.append("description", description);

  //   // Append fields (lessons) data
  //   fields.forEach((field, index) => {
  //     formData.append(`fields[${index}][name]`, field.name);
  //     formData.append(`fields[${index}][description]`, field.description);
  //     if (field.video) {
  //       // Append the video file if it exists
  //       formData.append(`fields[${index}][video]`, field.video); // Assuming field.video is the file object
  //     }
  //   });

  //   try {
  //     // Send the FormData to the backend
  //     await axios.post(`${BASE_URL}/language/languages`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data', // Important for file uploads
  //       },
  //     });
  //     navigate("/languages"); // Redirect to the languages list after successful submission
  //   } catch (error) {
  //     console.error("Error creating language:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create a FormData object to hold the data
    const formData = new FormData()

    // Append language data
    formData.append("languagename", languageName)
    formData.append("difficulties", difficulties)
    formData.append("description", description)

    // Append fields (lessons) data
    // fields.forEach((field, index) => {
    //   formData.append(`fields[${index}][name]`, field.name)
    //   formData.append(`fields[${index}][description]`, field.description)
    //   if (field.video) {
    //     // Append the video URL and public_id separately
    //     formData.append(`fields[${index}][video][url]`, field.video.url)
    //     formData.append(
    //       `fields[${index}][video][public_id]`,
    //       field.video.public_id
    //     )
    //   }
    // })

        // Append fields (lessons) data
        // fields.forEach((field, index) => {
        //   formData.append(`fields[${index}][name]`, field.name)
        //   formData.append(`fields[${index}][description]`, field.description)
        //   if (field.video) {
        //     formData.append(`fields[${index}][video]`, field.video) // Attach the file directly
        //   }
        // })

        fields.forEach((field, index) => {
          formData.append(`fields[${index}][name]`, field.name)
          formData.append(`fields[${index}][description]`, field.description)
          if (field.video) {
            formData.append(`fields[${index}][video]`, field.video) // Attach the file directly
          }
        })
    

    try {
      // Send the FormData to your backend API
      const response = await fetch(`${BASE_URL}/language/languages`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        // Handle successful submission
        console.log("Language data submitted successfully!")
        // ... (e.g., redirect to a success page)
        navigate("/languages") 
      } else {
        // Handle error
        console.error("Error submitting language data")
        // ... (e.g., display an error message)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
  console.log(fields)
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
  )
}

export default CreateLanguageForm
