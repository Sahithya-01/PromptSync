// src/Register.tsx
import { createUserWithEmailAndPassword, User } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from './firebase'

interface RegisterProps {
  onRegister?: (user: User, username: string) => void
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      onRegister && onRegister(user, username)

      // Initialize user document in Firestore with email and username
      await setDoc(doc(db, 'users', user.uid), { email, username })

      navigate('/login')
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-textPrimary">
      <div className="w-full max-w-md p-8 space-y-4 bg-card shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
          />
          <button
            type="submit"
            className="w-full py-2 text-white rounded-md bg-primary hover:bg-opacity-90 focus:outline-none"
          >
            Register
          </button>
        </form>
        <p className="text-center text-textSecondary">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
