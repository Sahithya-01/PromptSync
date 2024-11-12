import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { Provider } from '@lexical/yjs'
import { $createParagraphNode, $getRoot } from 'lexical'
import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import ExampleTheme from './ExampleTheme'
import PubNub from './PubNub'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import CustomPrompt from './CustomPrompt'

interface EditorProps {
  username: string | null
}

const editorConfig = {
  editorState: null,
  namespace: 'Sahithya',
  onError(error: Error) {
    throw error
  },
  theme: ExampleTheme,
}

const pubnubConfig = {
  endpoint: import.meta.env.VITE_PUBNUB_ENDPOINT || '',
  channel: '',
  auth: '',
  username: 'user-' + Math.random().toString(36).substr(2, 4),
  userId: 'user-id-' + Math.random().toString(36).substr(2, 9),
  publishKey: import.meta.env.VITE_PUBNUB_PUBLISH_KEY || '',
  subscribeKey: import.meta.env.VITE_PUBNUB_SUBSCRIBE_KEY || '',
}

function initialEditorState(): void {
  const root = $getRoot()
  const paragraph = $createParagraphNode()
  root.append(paragraph)
}

const CaptureTextButton: React.FC<{ onTextChange: (text: string) => void }> = ({
  onTextChange,
}) => {
  const [editor] = useLexicalComposerContext()

  const handleCaptureText = () => {
    editor.getEditorState().read(() => {
      const root = $getRoot()
      const textContent = root.getTextContent()
      onTextChange(textContent)
      editor.update(() => {}) // Trigger update for re-sync
    })
  }

  return (
    <button
      onClick={handleCaptureText}
      className="w-full py-2 px-4 bg-accent text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      Get Editor Text
    </button>
  )
}

const RefreshButton: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <button
      onClick={handleRefresh}
      className="w-full py-2 px-4 bg-secondary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      Refresh Editor
    </button>
  )
}

const Editor: React.FC<EditorProps> = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const location = useLocation()
  const username = location.state?.username || 'Anonymous'

  const [customPromptResult, setCustomPromptResult] = useState<string>('')
  const [editorText, setEditorText] = useState<string>('')

  return (
    <div className="editor-page p-6 min-h-screen bg-background text-textPrimary">
      <div className="username-label mb-4 text-center">
        <h2 className="text-xl font-semibold">{`Logged in as: ${username}`}</h2>
      </div>

      <div className="flex w-full" style={{ height: '70vh' }}>
        {/* Editor Section - 60% width */}
        <div className="editor-section bg-card p-6 rounded-lg shadow-md w-3/5 flex flex-col">
          <LexicalComposer initialConfig={editorConfig}>
            <ToolbarPlugin />
            <div className="editor-inner h-[70%]">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input border p-4 rounded-md h-4/5" />
                }
                placeholder={<span>Start typing...</span>}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <CollaborationPlugin
                username={username}
                providerFactory={(id, yjsDocMap) => {
                  const doc = new Y.Doc()
                  yjsDocMap.set(id, doc)
                  const provider = new WebsocketProvider(
                    pubnubConfig.endpoint,
                    roomId || 'default-room',
                    doc,
                    {
                      WebSocketPolyfill: PubNub as unknown as typeof WebSocket,
                      params: {
                        ...pubnubConfig,
                        channel: roomId || 'default-room',
                      },
                    }
                  ) as unknown as Provider
                  return provider
                }}
                id="yjs-collaboration-plugin"
                initialEditorState={initialEditorState}
                shouldBootstrap={false}
              />
            </div>
            {/* Button Section below Editor - Full width */}
            <div className="mt-4 flex space-x-4">
              <CaptureTextButton onTextChange={setEditorText} />
              <RefreshButton />
            </div>
          </LexicalComposer>
        </div>

        {/* Custom prompt Features Section - 40% width */}
        <div className="custom-prompt-container bg-card p-6 rounded-lg shadow-md w-2/5 ml-4">
          <CustomPrompt
            selectedText={editorText}
            onResult={(result) => setCustomPromptResult(result)}
          />
        </div>
      </div>
    </div>
  )
}

export default Editor
