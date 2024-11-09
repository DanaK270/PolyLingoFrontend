import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { HiReply } from 'react-icons/hi'

const Home = ({ issues, setIssues }) => {
  const [replies, setReplies] = useState({}) // Store reply text by issue or reply ID
  const [showMainReplyInput, setShowMainReplyInput] = useState({})
  const [showNestedReplyInput, setShowNestedReplyInput] = useState({})
  const initialState = { comment: '' }
  const [formState, setFormState] = useState(initialState)

  const replyRefs = useRef({})
  const issuesRef = useRef(null)

  useEffect(() => {
    const fetchIssues = async () => {
      if (issuesRef.current) return
      try {
        const response = await axios.get('http://localhost:3001/issues')
        setIssues(response.data)
        issuesRef.current = response.data
      } catch (err) {
        console.error('Error fetching issues:', err)
      }
    }
    fetchIssues()
  }, [setIssues])

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.id]: event.target.value })
  }

  const handleReplyChange = (id, event) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [id]: event.target.value
    }))
  }

  const submitReply = async (issueId, parentReplyId = null) => {
    const replyText = replies[parentReplyId || issueId]
    if (!replyText?.trim()) return

    try {
      const res = await axios.post(
        `http://localhost:3001/issues/${issueId}/reply`,
        {
          comment: replyText,
          parentReplyId
        }
      )

      const newReply = res.data

      setIssues((prevIssues) =>
        prevIssues.map((issue) => {
          if (issue._id === issueId) {
            const updatedReplies = parentReplyId
              ? updateReplies(issue.replies, parentReplyId, newReply)
              : [...issue.replies, newReply]

            return { ...issue, replies: updatedReplies }
          }
          return issue
        })
      )

      setReplies((prevReplies) => ({
        ...prevReplies,
        [parentReplyId || issueId]: ''
      }))
      setShowMainReplyInput((prev) => ({
        ...prev,
        [issueId]: false
      }))
      setShowNestedReplyInput((prev) => ({
        ...prev,
        [parentReplyId]: false
      }))
    } catch (err) {
      console.error('Error submitting reply:', err)
    }
  }

  const updateReplies = (replies, parentReplyId, newReply) => {
    return replies.map((reply) => {
      if (reply._id === parentReplyId) {
        return { ...reply, replies: [...reply.replies, newReply] }
      }
      if (reply.replies && reply.replies.length > 0) {
        return { ...reply, replies: updateReplies(reply.replies, parentReplyId, newReply) }
      }
      return reply
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3001/issues', formState)
      setIssues((prevIssues) => [...prevIssues, response.data])
      setFormState(initialState)
    } catch (err) {
      console.error('Error submitting issue:', err)
    }
  }

  const Reply = ({ issueId, reply, level = 0 }) => {
    const replyKey = level > 0 ? reply._id : issueId

    const createdAt = reply.createdAt ? new Date(reply.createdAt).toDateString() : "Invalid Date"
    const commentText = reply.comment || 'No comment available.'

    useEffect(() => {
      if (showNestedReplyInput[reply._id] && replyRefs.current[reply._id]) {
        replyRefs.current[reply._id].focus()
      }
    }, [showNestedReplyInput, reply._id])

    return (
      <div className={`reply-container ${level > 0 ? 'nested-reply' : ''}`} style={{ marginLeft: level * 20 + 'px' }}>
        <div className="reply-content">
          <p>{commentText} - <small>{createdAt}</small></p>
          <div className="reply-icon" onClick={() => setShowNestedReplyInput((prev) => ({
              ...prev, [reply._id]: !prev[reply._id]
            }))}>
            <HiReply />
          </div>
        </div>
        {showNestedReplyInput[reply._id] && (
          <div className="reply-form">
            <input
              type="text"
              value={replies[reply._id] || ''}
              onChange={(e) => handleReplyChange(reply._id, e)}
              placeholder="Write a reply to this reply..."
              ref={(el) => (replyRefs.current[reply._id] = el)}
            />
            <button onClick={() => submitReply(issueId, reply._id)}>Submit</button>
          </div>
        )}
        {reply.replies && reply.replies.length > 0 && (
          <div className="nested-replies">
            {reply.replies.map((nestedReply) => (
              <Reply key={nestedReply._id} issueId={issueId} reply={nestedReply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <h2>Issues</h2>
      <div className="issues-container">
        {issues.map((issue) => (
          <div key={issue._id} className="card issue-card mb-3">
            <div className="card-body">
              <p className="card-text">Comment: {issue.comment}</p>
              <p className="card-footer text-muted">
                <small>{new Date(issue.createdAt).toDateString()}</small>
              </p>
              <div className="reply-icon" onClick={() =>
                  setShowMainReplyInput((prev) => ({
                    ...prev,
                    [issue._id]: !prev[issue._id]
                  }))
                }>
                <HiReply />
              </div>
            </div>
            {showMainReplyInput[issue._id] && (
              <div className="reply-form">
                <input
                  type="text"
                  value={replies[issue._id] || ''}
                  onChange={(e) => handleReplyChange(issue._id, e)}
                  placeholder="Write a reply..."
                  style={{ width: '80%', marginTop: '5px' }}
                  ref={replyRefs.current[issue._id]}
                />
                <button onClick={() => submitReply(issue._id)}>Submit</button>
              </div>
            )}
            {issue.replies && issue.replies.length > 0 && (
              <div className="replies">
                {issue.replies.map((reply) => (
                  <Reply key={reply._id} issueId={issue._id} reply={reply} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <h3>Post a new issue</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          id="comment"
          value={formState.comment}
          onChange={handleChange}
          placeholder="Enter issue comment"
        />
        <button type="submit">Post Issue</button>
      </form>
    </div>
  )
}

export default Home
