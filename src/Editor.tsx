import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { Provider } from '@lexical/yjs'
import { $createParagraphNode, $getRoot, LexicalEditor } from 'lexical'
import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import ExampleTheme from './ExampleTheme'
import NlpFeatures from './NlpFeatures'
import PubNub from './PubNub'
import ToolbarPlugin from './plugins/ToolbarPlugin'

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

const Editor: React.FC<EditorProps> = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const location = useLocation()
  const username = location.state?.username || 'Anonymous'

  const [nlpResult, setNlpResult] = useState<string>('')
  const [editorText, setEditorText] = useState<string>('')

  // Capture the editor text whenever it updates
  const captureEditorText = (editor: LexicalEditor) => {
    editor.getEditorState().read(() => {
      const root = $getRoot()
      const textContent = root.getTextContent() // Get all text content in the editor
      setEditorText(textContent)
    })
  }
  // console.log('the text is ', captureEditorText)

  return (
    <div className="editor-page">
      {/* Username Label */}
      <div className="username-label">
        <h2>{`Logged in as: ${username}`}</h2>
      </div>

      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-section">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
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
        </div>

        {/* NLP Features Section */}
        <div className="nlp-container">
          <NlpFeatures
            selectedText={editorText} // Pass the captured editor text
            onResult={(result) => setNlpResult(result)}
          />
          <div className="nlp-result">
            <h4>Result</h4>
            <p>{nlpResult}</p>
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
}

export default Editor
