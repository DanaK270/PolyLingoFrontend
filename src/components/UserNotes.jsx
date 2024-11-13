import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserNotes = ({ userId }) => {
  const { lessonId } = useParams();
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Fetch notes from the backend or localStorage on initial load
  useEffect(() => {
    if (!userId || !lessonId) return;

    const fetchNotes = async () => {
      try {
        // Check if notes are available in localStorage
        const localNotes = localStorage.getItem(`notes-${userId}-${lessonId}`);
        if (localNotes) {
          setNotes(JSON.parse(localNotes)); // Set notes from localStorage
        } else {
          // If no local notes, fetch from the server
          const response = await axios.get(`http://localhost:3001/userNote/notes/user/${userId}/lesson/${lessonId}`);
          setNotes(response.data);
          // Save fetched notes to localStorage
          localStorage.setItem(`notes-${userId}-${lessonId}`, JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [userId, lessonId]); // Re-fetch when userId or lessonId changes

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(`notes-${userId}-${lessonId}`, JSON.stringify(notes));
    }
  }, [notes, userId, lessonId]);

  const handleCreateOrUpdateNote = async (e) => {
    e.preventDefault();
    if (!userId || !lessonId) return;

    if (selectedNoteId) {
      try {
        const response = await axios.put(`http://localhost:3001/userNote/notes/${selectedNoteId}`, {
          content,
        });
        const updatedNotes = notes.map((note) =>
          note._id === selectedNoteId ? response.data.updatedUserNote : note
        );
        setNotes(updatedNotes);
        setSelectedNoteId(null);
      } catch (error) {
        console.error('Error updating note:', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:3001/userNote/notes', {
          userId,
          lessonId,
          content,
        });
        const newNotes = [...notes, response.data.userNote];
        setNotes(newNotes);
      } catch (error) {
        console.error('Error creating note:', error);
      }
    }
    setContent('');
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:3001/userNote/notes/${noteId}`);
      const updatedNotes = notes.filter((note) => note._id !== noteId);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = (noteId) => {
    const note = notes.find((n) => n._id === noteId);
    setContent(note.content);
    setSelectedNoteId(noteId);
  };

  return (
    <div className="user-notes-container">
      <h1>User Notes for Lesson</h1>

      {/* Create or Update Note (Single Text Area) */}
      <form onSubmit={handleCreateOrUpdateNote} className="note-form">
        <h2>{selectedNoteId ? 'Update Note' : 'Create Note'}</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here"
          rows="5"
          required
        />
        <br />
        <button type="submit">{selectedNoteId ? 'Update Note' : 'Create Note'}</button>
      </form>

      {/* List of Notes */}
      <div className="notes-list">
        <h2>Your Notes</h2>
        {notes.length === 0 ? (
          <p>No notes available. Please create one.</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li key={note._id} className="note-item">
                <p>{note.content}</p>
                {/* Edit and Delete Buttons */}
                <button onClick={() => handleEditNote(note._id)}>Edit</button>
                <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};


export default UserNotes;


