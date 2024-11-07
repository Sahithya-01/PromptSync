import { GoogleGenerativeAI } from '@google/generative-ai'
import React, { useState } from 'react'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string

const client = new GoogleGenerativeAI(apiKey)

interface NlpFeaturesProps {
  selectedText: string
  onResult: (result: string) => void
}

const NlpFeatures: React.FC<NlpFeaturesProps> = ({
  selectedText,
  onResult,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [resultText, setResultText] = useState<string>('')

  // console.log('selected text is:', selectedText)

  const handleFeatureSubmit = async () => {
    if (!selectedFeature && !customPrompt) return
    setLoading(true)
    setResultText('')

    try {
      let prompt = ''

      if (selectedFeature === 'sentiment-analysis') {
        prompt = `Please analyze the sentiment of this text: "${selectedText}". Is it positive, neutral, or negative?`
        // console.log('selected text is:', selectedText)
      } else if (selectedFeature === 'summarization') {
        prompt = `Please provide a concise summary of the following text: "${selectedText}"`
      } else if (selectedFeature === 'spell-check') {
        prompt = `Check the spelling and context in the following text: "${selectedText}"`
      } else if (customPrompt) {
        prompt = `${customPrompt}: "${selectedText}"`
      }

      if (prompt) {
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContent(prompt)

        const responseText =
          result?.response?.text() || 'No valid response received'
        setResultText(responseText)
        onResult(responseText)
      } else {
        setResultText('No valid prompt or feature selected.')
      }
    } catch (error) {
      console.error('Error performing NLP:', error)
      setResultText('Error performing NLP feature.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="nlp-section">
      <h3>Select NLP Feature</h3>
      <select
        value={selectedFeature}
        onChange={(e) => setSelectedFeature(e.target.value)}
        className="nlp-dropdown"
      >
        <option value="">Select an option</option>
        <option value="summarization">Summarization</option>
        <option value="sentiment-analysis">Sentiment Analysis</option>
        <option value="spell-check">Contextual Spell Check</option>
      </select>

      <input
        type="text"
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder="Enter a custom prompt"
        className="custom-prompt-input"
      />

      <button
        onClick={handleFeatureSubmit}
        className="nlp-submit"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>

      <div className="nlp-result">
        <h4>Result:</h4>
        <p>{resultText}</p>
      </div>
    </div>
  )
}

export default NlpFeatures
