// src/Login.tsx
import React, { useState } from 'react'
import { signInWithEmailAndPassword, User } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

interface LoginProps {
  onLogin: (user: User, username: string) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null) // Clear previous errors

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      // Retrieve username from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const username = userDoc.exists() ? userDoc.data().username : 'Unknown'

      onLogin(user, username)
      navigate('/rooms', { state: { userId: user.uid } })
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('Invalid email or password. Please try again.') // Display error message
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-textPrimary">
      <div className="w-full max-w-md p-8 space-y-4 bg-card shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center">Login</h2>

        {/* Display Error Message */}
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 animate-pulse"
            role="alert"
          >
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md bg-background text-textPrimary border-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md bg-background text-textPrimary border-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card"
          />
          <button
            type="submit"
            className="w-full py-2 text-white rounded-md bg-primary hover:bg-opacity-90 focus:outline-none"
          >
            Login
          </button>
        </form>
        <p className="text-center text-textSecondary">
          Don’t have an account?{' '}
          <Link to="/register" className="text-accent hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
