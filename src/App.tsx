import { User } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Editor from './Editor'
import LandingPage from './LandingPage'
import Login from './Login'
import Register from './Register'
import RoomSelection from './RoomSelection'
import { auth } from './firebase' // Import your Firebase auth instance

// Define context for user state
interface AuthContextProps {
  user: User | null
  username: string | null
  handleLogin: (loggedInUser: User, username: string) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  const handleLogin = (loggedInUser: User, username: string) => {
    setUser(loggedInUser)
    setUsername(username)
  }

  // Persist user authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Optionally, fetch the username from Firestore if not stored in auth
      } else {
        setUser(null)
        setUsername(null)
      }
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, username, handleLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use Auth Context
const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// // Protected route wrapper
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user } = useAuth()
//   return user ? <>{children}</> : <Navigate to="/login" replace />
// }

function App() {
  const { user, username, handleLogin } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Landing Page */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/rooms"
          element={
            <RoomSelection username={username} userId={user ? user.uid : ''} />
          }
        />
        <Route
          path="/editor/:roomId"
          element={<Editor username={username} />}
        />
      </Routes>
    </Router>
  )
}

export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
