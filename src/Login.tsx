import React, { useState } from 'react'
import { signInWithEmailAndPassword, User } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from './firebase' // Import Firestore
import { doc, getDoc } from 'firebase/firestore'

interface LoginProps {
  onLogin: (user: User, username: string) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      navigate('/rooms') // Redirect to Room Selection page after login
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  )
}

export default Login
