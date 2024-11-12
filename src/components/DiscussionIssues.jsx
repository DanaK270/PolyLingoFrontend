import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HiReply, HiSpeakerphone } from 'react-icons/hi'; // Added HiSpeakerphone for the speaker icon

const DiscussionIssues = ({ issues, setIssues, id }) => {
  const [replies, setReplies] = useState({});
  const [showMainReplyInput, setShowMainReplyInput] = useState({});
  const [showNestedReplyInput, setShowNestedReplyInput] = useState({});
  const initialState = { comment: '' };
  const [formState, setFormState] = useState(initialState);
  const replyRefs = useRef({});

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.id]: event.target.value });
  };

  const handleReplyChange = (id, event) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [id]: event.target.value,
    }));
  };

  const submitReply = async (issueId, parentReplyId = null) => {
    const replyText = replies[parentReplyId || issueId];
    if (!replyText?.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:3001/issues/${issueId}/replies`,
        { comment: replyText, parentReplyId }
      );

      const newReply = res.data;

      setIssues((prevIssues) => {
        return prevIssues.map((issue) => {
          if (issue._id === issueId) {
            const updatedReplies = parentReplyId
              ? updateReplies(issue.replies, parentReplyId, newReply)
              : [...issue.replies, newReply];

            return { ...issue, replies: updatedReplies };
          }
          return issue;
        });
      });

      setReplies((prevReplies) => ({
        ...prevReplies,
        [parentReplyId || issueId]: '',
      }));

      setShowMainReplyInput((prev) => ({
        ...prev,
        [issueId]: false,
      }));

      setShowNestedReplyInput((prev) => ({
        ...prev,
        [parentReplyId]: false,
      }));

    } catch (err) {
      console.error('Error submitting reply:', err);
    }
  };

  const updateReplies = (replies, parentReplyId, newReply) => {
    return replies.map((reply) => {
      if (reply._id === parentReplyId) {
        return { ...reply, replies: [...reply.replies, newReply] };
      }

      if (reply.replies && reply.replies.length > 0) {
        return { ...reply, replies: updateReplies(reply.replies, parentReplyId, newReply) };
      }

      return reply;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { ...formState, discussionId: `${id}` };
      const response = await axios.post('http://localhost:3001/issues', formData);
      setIssues((prevIssues) => [...prevIssues, response.data]);
      setFormState(initialState);
    } catch (err) {
      console.error('Error submitting issue:', err);
    }
  };

  const Reply = ({ issueId, reply, level = 0 }) => {
    const replyKey = level > 0 ? reply._id : issueId;
    const createdAt = reply.createdAt ? new Date(reply.createdAt).toDateString() : "Invalid Date";
    const commentText = reply.comment || 'No comment available.';

    useEffect(() => {
      if (showNestedReplyInput[reply._id] && replyRefs.current[reply._id]) {
        replyRefs.current[reply._id].focus();
      }
    }, [showNestedReplyInput, reply._id]);

    // Function to trigger speech synthesis
    const handleSpeech = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    };

    return (
      <div className={`reply-container ${level > 0 ? 'nested-reply' : ''}`} style={{ marginLeft: level * 20 + 'px' }}>
        <div className="reply-content">
          <p>{commentText} - <small>{createdAt}</small></p>
          <div className="reply-icons">
            {/* Reply Icon */}
            <div
              className="reply-icon"
              onClick={() => setShowNestedReplyInput((prev) => ({
                ...prev,
                [reply._id]: !prev[reply._id],
              }))}
            >
              <HiReply />
              
            </div>
            {/* Speaker Icon */}
            <div
              className="speaker-icon"
              onClick={() => handleSpeech(commentText)}
            >
              <HiSpeakerphone />
            </div>
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
    );
  };

  return (
    <div className="discussion-container">
      {issues.map((issue) => (
        <div key={issue._id} className="issue-container">
          <div className="issue-header">
            <h3>{issue.comment}</h3>
            <div
              className="reply-btn"
              onClick={() => setShowMainReplyInput((prev) => ({
                ...prev,
                [issue._id]: !prev[issue._id],
              }))}
            >
              <HiReply  />
            </div>
          </div>

          {showMainReplyInput[issue._id] && (
            <div className="reply-form">
              <input
                type="text"
                value={replies[issue._id] || ''}
                onChange={(e) => handleReplyChange(issue._id, e)}
                placeholder="Write a reply..."
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

      <form onSubmit={handleSubmit} className="issue-form">
        <input
          id="comment"
          type="text"
          value={formState.comment}
          onChange={handleChange}
          placeholder="Write a new issue..."
        />
        <button type="submit">Submit Issue</button>
      </form>
    </div>
  );
};

export default DiscussionIssues;
