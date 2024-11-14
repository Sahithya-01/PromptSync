import React from 'react'
import { FaRegComments, FaRobot, FaUsers } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-background text-text-primary min-h-screen flex flex-col  items-center">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center bg-primary mt-0 text-white py-16 px-6 w-full transition-colors duration-300">
        <h1 className="text-6xl font-bold mb-3 tracking-tight">
          <span className="text-accent">Prompt</span>Sync
        </h1>
        <p className="text-lg mb-6 text-center max-w-xl leading-relaxed">
          A real-time collaborative editor that brings your team together with
          live presence indicators and smart AI prompts.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-10 px-6 text-center max-w-screen-lg w-full bg-background text-text-primary transition-colors duration-300">
        <h2 className="text-3xl font-semibold mb-6">
          What Makes <span className="text-accent">PromptSync</span> Unique?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            icon={<FaUsers className="text-4xl" />}
            title="Real-Time Collaboration"
            description="Collaborate seamlessly with your team. Live presence indicators show who’s editing in real time, making teamwork more efficient."
          />
          <Feature
            icon={<FaRegComments className="text-4xl" />}
            title="Custom Prompts on Content"
            description="Easily ask questions about your content, summarize, or generate insights. Our custom prompt feature gives you AI-powered answers for in-context assistance."
          />
          <Feature
            icon={<FaRobot className="text-4xl" />}
            title="AI-Powered Responses"
            description="Receive real-time responses from AI for any prompts you input, directly within your editing workflow, enhancing decision-making on the spot."
          />
        </div>
      </section>

      {/* AI and Collaboration Explanation */}
      <section className="py-6 px-6 text-center max-w-screen-md w-full bg-card text-text-primary transition-colors duration-300">
        <h2 className="text-3xl font-semibold mb-2">AI at Your Fingertips</h2>
        <p className="text-lg leading-relaxed text-text-secondary">
          Type any prompt related to your content directly into the editor, and
          let our AI provide instant insights, summaries, or answers, helping
          you make informed decisions on the spot.
        </p>
      </section>

      {/* Final Call to Action */}
      <section className="py-8 text-center bg-background w-full transition-colors duration-300">
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
  <div className="text-center p-6 bg-card text-text-primary rounded-lg shadow-md transition-colors duration-300">
    <div className="text-accent mb-4 flex justify-center text-4xl">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
  </div>
)

export default LandingPage
