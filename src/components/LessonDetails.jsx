import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserNotes from './UserNotes'; // Import the UserNotes component

const LessonDetails = ({ issues, setIssues, userId }) => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/language/lesson/${lessonId}`);
        setLesson(response.data);
      } catch (error) {
        console.error('Error fetching lesson details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!lesson) return <p className="error-text">Lesson not found.</p>;

  return (
    <div className="lesson-details-container">
      <div className="lesson-card">
        <h3 className="lesson-name">{lesson.name} Details</h3>
        <p className="lesson-description">{lesson.description}</p>
        {lesson.video && lesson.video.length > 0 && (
          <div className="video-section">
            <h4 className="video-title">Videos</h4>
            {lesson.video.map((video, index) => (
              <video key={index} className="lesson-video" src={video.url} controls />
            ))}
          </div>
        )}

        {/* Render UserNotes component within LessonDetails */}
        <UserNotes userId={userId} />

        {/* Optionally, render other components like Discussion */}
        {/* <Discussion2 selectedLesson={lesson} issues={issues} setIssues={setIssues} /> */}
      </div>
    </div>
  );
};

export default LessonDetails;
