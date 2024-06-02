import React, { useState } from 'react';

const UnifiedSearch = ({ placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [searchType, setSearchType] = useState('course');
  const [searchResults, setSearchResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchResults(null);
    setSelectedResult(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = 'http://localhost:5000';
    let url = '';
    if (searchType === 'course') {
      url = `${baseUrl}/find_course/?query=${encodeURIComponent(inputValue)}`;
    } else if (searchType === 'professor') {
      url = `${baseUrl}/find_professor/?query=${encodeURIComponent(inputValue)}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      setSearchResults(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('Failed to fetch data: ' + error.message);
    }
  };

  const handleResultClick = (result) => {
    if (searchType === 'course') {
      setSelectedResult({
        name: result.name,
        total_students: result.total_students,
        average_grade_distribution_percentage: result.average_grade_distribution_percentage
      });
    } else {
      setSelectedResult(result);
    }
  };

  const handleCommentSubmit = async () => {
    const url = 'http://localhost:5000/add_comment/';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: selectedResult.name,
        comment: comment,
      }),
    });
    if (response.ok) {
      console.log(`Submitted comment for ${selectedResult.name}: ${comment}`);
      setComments([...comments, { id: Date.now(), text: comment, likes: 0, replies: [] }]);
      setComment('');
    }
  };

  const handleLike = (commentId) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleReply = (commentId, reply) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...comment.replies, reply] };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderCourseResults = () => {
    if (!searchResults || !searchResults.professors) {
      return null;
    }

    return (
      <div className="modal">
        <h2>{searchResults.subject}</h2>
        <ul>
          {Object.entries(searchResults.professors).map(([name, info], index) => (
            <li key={index} onClick={() => handleResultClick({ name, ...info })}>
              {name}
            </li>
          ))}
        </ul>
        <button onClick={handleCloseModal}>Close</button>
      </div>
    );
  };

  const renderProfessorResults = () => {
    if (!searchResults || !Array.isArray(searchResults)) {
      return null;
    }

    return (
      <div className="modal">
        <h2>Search Results</h2>
        <ul>
          {searchResults.map((result, index) => (
            <li key={index} onClick={() => handleResultClick(result)}>
              {result.name}
            </li>
          ))}
        </ul>
        <button onClick={handleCloseModal}>Close</button>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="search-container">
        <select value={searchType} onChange={(e) => handleSearchTypeChange(e.target.value)} className="search-selector">
          <option value="course">Search Course</option>
          <option value="professor">Search Professor</option>
        </select>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {showModal && (
        searchType === 'course' ? renderCourseResults() : renderProfessorResults()
      )}
      {selectedResult && (
        <div className="info-panel">
          <h2>{selectedResult.name}</h2>
          {searchType === 'course' && (
            <>
              <p>Total Students: {selectedResult.total_students}</p>
              <div className="grade-table-container">
                <table className="grade-table">
                  <thead>
                    <tr>
                      <th>Grade</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedResult.average_grade_distribution_percentage).map(([grade, percentage]) => (
                      <tr key={grade}>
                        <td>{grade}</td>
                        <td>{percentage.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {searchType === 'professor' && (
            <ul>
              {selectedResult.courses && selectedResult.courses.map((course, index) => (
                <li key={index}>{course}</li>
              ))}
            </ul>
          )}
          <div className="comment-section">
            <h3>Comments</h3>
            <div className="comment-input">
              <textarea
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button onClick={handleCommentSubmit}>Submit</button>
            </div>
            <ul className="comment-list">
              {comments.map(comment => (
                <li key={comment.id} className="comment-item">
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <button className="like-button" onClick={() => handleLike(comment.id)}>
                      <span role="img" aria-label="like">👍</span> {comment.likes}
                    </button>
                    <div className="reply-input">
                      <input type="text" placeholder="Reply..." />
                      <button onClick={(e) => handleReply(comment.id, e.target.previousSibling.value)}>Reply</button>
                    </div>
                  </div>
                  {comment.replies.length > 0 && (
                    <ul className="reply-list">
                      {comment.replies.map((reply, index) => (
                        <li key={index} className="reply-item">{reply}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default UnifiedSearch;