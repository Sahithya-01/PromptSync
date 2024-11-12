import './styles.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import ThemeToggle from './ThemeToggle' // Import ThemeToggle component
import App from './App.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="App">
      <ThemeToggle /> {/* Add ThemeToggle button */}
      <App />
    </div>
  </React.StrictMode>
)
