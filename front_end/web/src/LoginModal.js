import React, { useState } from 'react';

export const LoginModal = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await onLogin(username, password);
      onClose(data.username);
    } catch (error) {
      if (error.message === 'Invalid password') {
        setErrorMessage('Password error');
      } else if (error.message === 'Invalid username') {
        setErrorMessage('Invalid username');
      } else {
        setErrorMessage('Login failed');
      }
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="loginButton">
          Login
        </button>
        <button onClick={onClose} className="closeButton">
          Close
        </button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};