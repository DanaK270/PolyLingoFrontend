import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DiscussionIssues from './DiscussionIssues' // Assuming you have this component

const Discussion2 = ({ selectedLesson, issues, setIssues }) => {
  const [discussions, setDiscussions] = useState([])
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch all discussions for the selected lesson
  useEffect(() => {
    if (!selectedLesson) return

    const fetchDiscussions = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:3001/issues/discussions/${selectedLesson._id}`
        )
        setDiscussions(response.data)
      } catch (error) {
        console.error('Error fetching discussions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [selectedLesson])

  // Fetch issues for the selected discussion
  const handleDiscussionClick = async (discussionId) => {
    setSelectedDiscussionId(discussionId)
    setLoading(true)
    setIssues([]) // Clear previous issues before fetching new ones
    try {
      const response = await axios.get(
        `http://localhost:3001/issues/${discussionId}/discussion`
      )
      setIssues(response.data) // Set the issues for the selected discussion
    } catch (error) {
      console.error('Error fetching issues', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="discussion-container">
      <h2 className="discussion-header">Discussions</h2>

      {loading && <p className="loading-text">Loading discussions...</p>}
      {!loading && discussions.length === 0 && (
        <p className="no-discussions-text">No discussions available.</p>
      )}

      {!loading && discussions.length > 0 && (
        <div className="discussions-list">
          <h3 className="discussions-title">All Discussions:</h3>
          <ul className="discussion-items">
            {discussions.map((discussion) => (
              <li key={discussion._id} className="discussion-item">
                <button
                  className="discussion-btn"
                  onClick={() => handleDiscussionClick(discussion._id)}
                >
                  {discussion.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedDiscussionId && !loading && issues.length > 0 && (
        <DiscussionIssues
          issues={issues}
          setIssues={setIssues}
          id={selectedDiscussionId}
        />
      )}
      {selectedDiscussionId && !loading && issues.length === 0 && (
        <p className="no-issues-text">
          No issues available for this discussion.
        </p>
      )}
      {selectedDiscussionId && !loading && issues.length <= 0 && (
        <DiscussionIssues
          issues={issues}
          setIssues={setIssues}
          id={selectedDiscussionId}
        />
      )}
    </div>
  )
}

export default Discussion2
