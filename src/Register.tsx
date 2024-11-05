import { createUserWithEmailAndPassword, User } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from './firebase'
import { db } from './firebase' // Import Firestore

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

      // Save the username in Firestore under the user's document
      await setDoc(doc(db, 'users', user.uid), { email, username })

      navigate('/login') // Redirect to Login after registration
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  )
}

export default Register
