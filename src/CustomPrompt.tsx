import { GoogleGenerativeAI } from '@google/generative-ai'
import React, { useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string
const client = new GoogleGenerativeAI(apiKey)

interface CustomPromptProps {
  selectedText: string
  onResult: (result: string) => void
}

const CustomPrompt: React.FC<CustomPromptProps> = ({
  selectedText,
  onResult,
}) => {
  const [customPrompt, setCustomPrompt] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [resultText, setResultText] = useState<string>('')

  const handleFeatureSubmit = async () => {
    if (!customPrompt) return
    setLoading(true)
    setResultText('')

    try {
      const prompt = `${customPrompt}: "${selectedText}"`
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent(prompt)
      const responseText =
        result?.response?.text() || 'No valid response received'
      setResultText(responseText)
      onResult(responseText)
    } catch (error) {
      console.error('Error performing cutom prompt:', error)
      setResultText('Error performing custom prompt feature.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="custom-prompt-section">
      <h3 className="text-xl font-semibold mb-4">Enter Custom Prompt</h3>
      <div className="flex items-center">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter a custom prompt"
          className="w-full p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleFeatureSubmit}
          className="p-2 bg-primary text-white rounded-r-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        >
          {loading ? '...' : <FaArrowRight />}
        </button>
      </div>

      <div className="custom-prompt-result mt-4 overflow-y-auto">
        <h4>Result:</h4>
        <p className="text-textSecondary">{resultText}</p>
      </div>
    </div>
  )
}

export default CustomPrompt
