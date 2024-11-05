import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { User } from 'firebase/auth' // Import User type from Firebase Auth
import Register from './Register'
import Login from './Login'
import RoomSelection from './RoomSelection'
import Editor from './Editor'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  const handleLogin = (loggedInUser: User, username: string) => {
    setUser(loggedInUser)
    setUsername(username)
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />{' '}
        {/* Redirect "/" to "/login" */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/rooms" element={<RoomSelection username={username} />} />
        <Route
          path="/editor/:roomId"
          element={<Editor username={username} />}
        />
      </Routes>
    </Router>
  )
}

export default App
