import React, { useState, useEffect } from "react"
import axios from "axios"
import LanguageCard from "../components/LessonCard"
import { useNavigate } from "react-router-dom"

const BASE_URL = "http://localhost:3001"

const LanguageList=({ user })=>{
  const [languages,setLanguages]=useState([])
  const navigate = useNavigate()
  useEffect(() => {
    getLanguages()
  }, [])
  const getLanguages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/language/languages`)
      setLanguages(response.data)
    } catch (error) {
      console.error("Failed to fetch languages:", error)
    }
  }
  const handleEdit = (language) => {
    navigate("/languages/edit", { state: { language } })
  }
  const handleDelete = async (languageId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Language?"
    )
    if (!confirmDelete) return

    try {
      await axios.delete(`${BASE_URL}/language/languages/${languageId}`)
      setLanguages(languages.filter((language) => language._id !== languageId))
      alert("Language deleted successfully!")
    } catch (error) {
      console.error("Error deleting Language:", error)
    }
  }
  return (
    <div>
      <h1 className="languagelist-title">Languages</h1>
      <div className="languages">
        {languages.map((language) => (
          <div key={language._id}>
            <LanguageCard
              user={user}
              language={language}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
export default LanguageList 