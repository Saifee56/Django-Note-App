import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username: username,
      email: email,
      password1: password1,
      password2: password2,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/signup/', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage(response.data.message);
      setUsername('');
      setEmail('');
      setPassword1('');
      setPassword2('');

      console.log('Signup successful:', response.data.message);
    } catch (error) {

      if (error.response) {
        setErrorMessage(error.response.data.message || 'An error occurred');
      } else {
        setErrorMessage('Network error or server not reachable');
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password1"
          placeholder="Password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {/* Display success message after successful signup */}
      {successMessage && (
        <div style={{ color: 'green' }}>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Signup;
