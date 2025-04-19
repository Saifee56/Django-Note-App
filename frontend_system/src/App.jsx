// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import Signup from './components/Signup';
import Login from './components/Login';
import Notes from './components/Note';
import CreateNote from './components/CreateNote';
import UpdateNote from './components/UpdateNote';
import GetAllNotes from './components/GetAllNotes';
import DeleteNote from './components/DeleteNote';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import UserActivityHistory from './components/UserActivityHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />s
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/create-note" element={<CreateNote />} />
        <Route path="/update-note/:id" element={<UpdateNote />} />

        <Route path="/get-all-notes" element={<GetAllNotes />} />
        <Route path="/delete" element={<DeleteNote />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-activity/:username" element={<UserActivityHistory />} />


      </Routes>
    </Router>
  );
}

export default App;
