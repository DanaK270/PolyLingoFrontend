import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DiscussionIssues from './DiscussionIssues'; // Assuming you have this component

const Discussion2 = ({ selectedLesson, issues, setIssues }) => {
  console.log(selectedLesson)
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all discussions for the selected lesson
  useEffect(() => {
    if (!selectedLesson) return;
  
    const fetchDiscussions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/issues/discussions/${selectedLesson._id}`);
        console.log(response)
        setDiscussions(response.data);
      } catch (error) {
        console.error('Error fetching discussions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDiscussions();
  }, [selectedLesson]);

  // Fetch issues for the selected discussion
  const handleDiscussionClick = async (discussionId) => {
    setSelectedDiscussionId(discussionId);
    setLoading(true);
    setIssues([]); // Clear previous issues before fetching new ones
    try {
      const response = await axios.get(`http://localhost:3001/issues/${discussionId}/discussion`);
      setIssues(response.data); // Set the issues for the selected discussion
    } catch (error) {
      console.error('Error fetching issues', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Discussions</h2>

      {loading && <p>Loading discussions...</p>}
      {!loading && discussions.length === 0 && <p>No discussions available.</p>}

      {!loading && discussions.length > 0 && (
        <div>
          <h3>All Discussions:</h3>
          <ul>
            {discussions.map((discussion) => (
              <li key={discussion._id}>
                <button onClick={() => handleDiscussionClick(discussion._id)}>
                  {discussion.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedDiscussionId && !loading && issues.length > 0 && <DiscussionIssues issues={issues} />}
      {selectedDiscussionId && !loading && issues.length === 0 && <p>No issues available for this discussion.</p>}
    </div>
  );
};

export default Discussion2;
