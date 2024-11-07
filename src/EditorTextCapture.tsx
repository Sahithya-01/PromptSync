import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useCallback, useEffect } from 'react'

interface EditorTextCaptureProps {
  onResult: (text: string) => void // Specify text as a string
}

const EditorTextCapture: React.FC<EditorTextCaptureProps> = ({ onResult }) => {
  const [editor] = useLexicalComposerContext()

  const captureEditorText = useCallback(() => {
    editor.getEditorState().read(() => {
      const root = editor.getRootElement()
      const textContent = root?.textContent || '' // Fallback to empty string if no text
      onResult(textContent) // Pass textContent as a string
    })
  }, [editor, onResult])

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(() => {
      captureEditorText()
    })

    return () => {
      unregisterListener()
    }
  }, [captureEditorText, editor])

  return null
}

export default EditorTextCapture
