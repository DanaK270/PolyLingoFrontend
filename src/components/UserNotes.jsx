import React, { useState, useEffect } from 'react'
import axios from 'axios'

const UserNotes = ({ userId }) => {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [currentNoteId, setCurrentNoteId] = useState(null)
  console.log('user',userId)
  // get user
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`userNote/notes/user/${userId}`)
        console.log('rresponwe', response)
        setNotes(response.data.data)
      } catch (error) {
        console.error('Error fetching user notes:', error)
      }
    }
    fetchNotes()
  }, [])

  // new note
  const handleAddNote = async () => {
    try {
      const response = await axios.post('userNote/notes', { userId, content })
      setNotes([...notes, response.data.userNote])
      setContent('')
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  // update note
  const handleUpdateNote = async () => {
    try {
      const response = await axios.put(`userNote/notes/${currentNoteId}`, {
        content
      })
      setNotes(
        notes.map((note) =>
          note._id === currentNoteId ? response.data.updatedUserNote : note
        )
      )
      setIsEditing(false)
      setContent('')
      setCurrentNoteId(null)
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  //delete note
  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`/notes/${noteId}`)
      setNotes(notes.filter((note) => note._id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  // edit note
  const startEditing = (note) => {
    setIsEditing(true)
    setContent(note.content)
    setCurrentNoteId(note._id)
  }

  return (
    <div>
      {console.log('otes', notes)}
      hi
      {/* <h1>(${name}) Notes</h1> */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts down!"
        />
        {isEditing ? (
          <button onClick={handleUpdateNote}>Update Note</button>
        ) : (
          <button onClick={handleAddNote}>Add Note</button>
        )}
      </div>
      <div>
        <h2>Your Notes</h2>
        {notes.map((note) => (
          <div
            key={note._id}
            style={{
              marginBottom: '1em',
              border: '1px solid #ddd',
              padding: '1em'
            }}
          >
            <p>{note.content}</p>
            <button onClick={() => startEditing(note)}>Edit</button>
            <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserNotes
