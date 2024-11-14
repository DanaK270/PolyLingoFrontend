import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserProgressOverview = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('http://localhost:3001/userProgress', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProgressData(response.data.data);
    } catch (error) {
      console.error('Error fetching user progress', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/userProgress/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.data.success) {
        setProgressData(progressData.filter((progress) => progress._id !== id));
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting user progress', error);
    }
  };

  if (loading) return <p>Loading user progress...</p>;

  return (
    <div className="progress-overview">
      <h2>Your Language Learning Progress</h2>
      {progressData.length === 0 ? (
        <p>No progress data available.</p>
      ) : (
        <table className="progress-table">
          <thead>
            <tr>
              <th>Language</th>
              <th>Total Points</th>
              <th>Streak</th>
              <th>Completed Lessons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {progressData.map((progress) => (
              <tr key={progress._id}>
                <td>
                  <Link to={`/progress/${progress._id}`} className="table-link">
                    {progress.language_id?.languagename || 'N/A'}
                  </Link>
                </td>
                <td>{progress.totalPoints}</td>
                <td>{progress.streak}</td>
                <td>
                  {progress.completedLessons.length > 0 ? (
                    progress.completedLessons.map((lesson, index) => (
                      <span key={lesson._id}>
                        {lesson.name}
                        {index < progress.completedLessons.length - 1 && ', '}
                      </span>
                    ))
                  ) : (
                    <span>No lessons completed</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(progress._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserProgressOverview;
