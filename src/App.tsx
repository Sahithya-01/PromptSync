// src/App.tsx
import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from './firebase'

import Register from './Register'
import Login from './Login'
import RoomSelection from './RoomSelection'
import Editor from './Editor'

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return unsubscribe // Cleanup subscription on unmount
  }, [])

  const handleLogout = () => {
    signOut(auth).then(() => setUser(null))
  }

  return (
    <Router>
      <div className="App">
        <h1>PubNub Collaborative Shared Document Editor with Lexical</h1>
        <Routes>
          {/* Redirects based on user authentication status */}
          <Route
            path="/"
            element={
              user ? <Navigate to="/rooms" /> : <Navigate to="/register" />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route
            path="/rooms"
            element={user ? <RoomSelection /> : <Navigate to="/login" />}
          />
          <Route
            path="/editor/:roomId"
            element={
              user ? (
                <div>
                  <h2>Welcome, {user.email}</h2>
                  <button onClick={handleLogout}>Logout</button>
                  <Editor />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
