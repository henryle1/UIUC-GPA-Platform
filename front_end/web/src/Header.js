import React, { useState } from 'react';
import logoImage from './img/icon.png';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';
import { login, signup } from './authService';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setShowLogin(false);
  };

  return (
    <header className="App-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <img src={logoImage} alt="Logo" style={{ height: '50px' }} />
      <div>
        {loggedInUser ? (
          <span>Welcome, {loggedInUser}!</span>
        ) : (
          <>
            <button className="login-button" onClick={() => setShowLogin(true)} style={{ marginRight: '10px' }}>
              Login
            </button>
            <button className="signup-button" onClick={() => setShowSignup(true)}>
              Signup
            </button>
          </>
        )}
      </div>
      {showLogin && <LoginModal onClose={handleLogin} onLogin={login} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSignup={signup} />}
    </header>
  );
};

export default Header;