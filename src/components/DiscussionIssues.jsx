import React from 'react';

const DiscussionIssues = ({ issues }) => {
  return (
    <div>
      <h3>Issues for this Discussion:</h3>
      {issues.length === 0 ? (
        <p>No issues found for this discussion.</p>
      ) : (
        issues.map((issue) => (
          <div key={issue._id}>
            <h4>{issue.comment}</h4>
            {issue.replies && issue.replies.length > 0 && (
              <div style={{ marginLeft: '20px' }}>
                <h5>Replies:</h5>
                {issue.replies.map((reply) => (
                  <div key={reply._id}>
                    <p><strong>Reply:</strong> {reply.comment}</p>
                    {/* You can recursively display nested replies if needed */}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DiscussionIssues;
