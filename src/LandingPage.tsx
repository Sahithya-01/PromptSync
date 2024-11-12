import React from 'react'
import { FaUsers, FaRobot, FaRegComments } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-background text-textPrimary min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center bg-primary text-white py-16 px-6">
        <h1 className="text-6xl font-bold mb-3 tracking-tight">
          <span className="text-accent">Prompt</span>Sync
        </h1>
        <p className="text-lg mb-6 text-center max-w-xl leading-relaxed">
          A real-time collaborative editor that brings your team together with
          live presence indicators and smart AI prompts.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-10 px-6 text-center max-w-screen-lg">
        <h2 className="text-3xl font-semibold mb-6">
          What Makes <span className="text-accent">PromptSync</span> Unique?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            icon={<FaUsers className="text-4xl" />}
            title="Real-Time Collaboration"
            description="Work alongside your team, with live presence indicators showing who's editing, reading, or commenting in real time."
          />
          <Feature
            icon={<FaRegComments className="text-4xl" />}
            title="Custom Prompts on Content"
            description="Ask AI questions directly related to the content in the editor. Summarize, analyze, or generate insights with ease."
          />
          <Feature
            icon={<FaRobot className="text-4xl" />}
            title="AI-Powered Responses"
            description="Get real-time answers from AI to any custom prompts you ask, directly integrated into your editing workflow."
          />
        </div>
      </section>

      {/* AI and Collaboration Explanation */}
      <section className="py-6 px-6 text-center max-w-screen-md">
        <h2 className="text-3xl font-semibold mb-2">AI at Your Fingertips</h2>
        <p className="text-lg leading-relaxed">
          Type any prompt related to your content directly into the editor, and
          let our AI provide instant insights, summaries, or answers, helping
          you make informed decisions on the spot.
        </p>
      </section>

      {/* Final Get Started Button */}
      <section className="py-8 text-center">
        <button
          onClick={() => navigate('/register')}
          className="bg-primary py-3 px-8 text-white rounded-full text-lg hover:bg-opacity-90 focus:outline-none transition-transform transform hover:scale-105"
        >
          Get Started
        </button>
      </section>
    </div>
  )
}

// Feature Component
const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="text-center p-4 bg-card rounded-lg shadow-md">
    <div className="text-accent mb-2 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-1">{title}</h3>
    <p className="text-sm leading-relaxed">{description}</p>
  </div>
)

export default LandingPage
