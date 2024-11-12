import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserNotes = ({ userId }) => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [updatedContent, setUpdatedContent] = useState('');
  const [lessonId] = useState('6731cd00682c379f21e64e62'); 

  
  // Fetch all notes for the user
  useEffect(() => {
    if (!userId) return; // Avoid fetch if userId is not available

    const fetchNotes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/userNote/notes/user/${userId}`);
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [userId]); // Only re-run if userId changes

  // Handle creating a new note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!userId) return; // Guard clause to ensure userId is present

    try {
      const response = await axios.post('http://localhost:3001/userNote/notes', {
        userId,
        lessonId,
        content
      });
      setNotes([...notes, response.data.userNote]); // Update the notes list with the new note
      setContent(''); // Clear content field after submission
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Handle selecting a note to view its details
  const handleViewNote = (noteId) => {
    setSelectedNoteId(noteId);
    const note = notes.find((n) => n._id === noteId);
    if (note) {
      setUpdatedContent(note.content); // Pre-fill content in the update form
    }
  };

  // Handle updating a note
  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!selectedNoteId) return; // Ensure a note is selected for updating

    try {
      const response = await axios.put(`http://localhost:3001/userNote/notes/${selectedNoteId}`, {
        content: updatedContent
      });
      const updatedNotes = notes.map((note) =>
        note._id === selectedNoteId ? response.data.updatedUserNote : note
      );
      setNotes(updatedNotes); // Update the notes list with the updated note
      setSelectedNoteId(null); // Clear selection after updating
      setUpdatedContent(''); // Clear update content field
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:3001/userNote/notes/${noteId}`);
      setNotes(notes.filter((note) => note._id !== noteId)); // Remove the deleted note from the list
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div>
      <h1>User Notes</h1>

      {/* Create Note Form */}
      <div>
        <h2>Create Note</h2>
        <form onSubmit={handleCreateNote}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here"
            rows="5"
            required
          />
          <br />
          <button type="submit">Create Note</button>
        </form>
      </div>

      {/* List of Notes */}
      <div>
        <h2>Your Notes</h2>
        {notes.length === 0 ? (
          <p>No notes available. Please create one.</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li key={note._id}>
                <h3>{note.lessonId ? note.lessonId.name : 'Lesson Name'}</h3>
                <p>{note.content}</p>
                <button onClick={() => handleViewNote(note._id)}>View</button>
                <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* View and Update Note */}
      {selectedNoteId && (
        <div>
          <h2>Update Note</h2>
          <form onSubmit={handleUpdateNote}>
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              placeholder="Update your note"
              rows="5"
              required
            />
            <br />
            <button type="submit">Update Note</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserNotes;
