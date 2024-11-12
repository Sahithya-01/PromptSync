// ThemeToggle.tsx
import { Classic } from '@theme-toggles/react'
import '@theme-toggles/react/css/Classic.css'
import React, { useEffect, useState } from 'react'

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode((prev) => !prev)

  return (
   
      <Classic
        toggled={isDarkMode}
        toggle={toggleTheme}
        duration={750}
        className="theme-toggle"
        color="black" // Default color prop to avoid missing properties
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
  
  )
}

export default ThemeToggle
