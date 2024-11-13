import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { Provider } from '@lexical/yjs'
import { $createParagraphNode, $getRoot,$createTextNode } from 'lexical'
import React, { useState,useEffect,useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import ExampleTheme from './ExampleTheme'
import PubNub from './PubNub'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import CustomPrompt from './CustomPrompt'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'

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
  channel: editorConfig.namespace,
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

const Editor: React.FC<EditorProps> = React.memo(() => {
  const { roomId } = useParams<{ roomId: string }>()
  const location = useLocation()
  const initialUsername = location.state?.username || 'Anonymous'

  const [customPromptResult, setCustomPromptResult] = useState<string>('')
  const [editorText, setEditorText] = useState<string>('')
  const providerRef = useRef<Provider | null>(null)
  const username = useRef(initialUsername)

  const handleEditorChange = (editorState: any) => {
    editorState.read(() => {
      const root = $getRoot()
      const textContent = root.getTextContent()
      setEditorText(textContent)
      console.log('Current Editor Text:', textContent)
    })
  }

  useEffect(() => {
    if (!providerRef.current && roomId) {
      const doc = new Y.Doc()
      providerRef.current = new WebsocketProvider(
        pubnubConfig.endpoint,
        roomId,
        doc,
        {
          WebSocketPolyfill: PubNub as unknown as typeof WebSocket,
          params: {
            ...pubnubConfig,
            channel: roomId,
          },
        }
      ) as unknown as Provider

      // Clean up the provider when the component unmounts
      return () => {
        providerRef.current?.disconnect()
        providerRef.current = null
      }
    }
  }, [roomId])

  return (
    <div className="editor-page p-6 min-h-screen bg-background text-textPrimary">
      <div className="username-label mb-4 text-center">
        <h2 className="text-xl font-semibold">{`Logged in as: ${username.current}`}</h2>
      </div>

      <div className="flex w-full" style={{ height: '70vh' }}>
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
                username={username.current}
                providerFactory={(id, yjsDocMap) => {
                  if (!providerRef.current) {
                    const doc = new Y.Doc()
                    yjsDocMap.set(id, doc)
                    providerRef.current = new WebsocketProvider(
                      pubnubConfig.endpoint,
                      roomId || 'default-room',
                      doc,
                      {
                        WebSocketPolyfill:
                          PubNub as unknown as typeof WebSocket,
                        params: {
                          ...pubnubConfig,
                          channel: roomId || 'default-room',
                        },
                      }
                    ) as unknown as Provider
                  }
                  return providerRef.current
                }}
                id="yjs-collaboration-plugin"
                initialEditorState={initialEditorState}
                shouldBootstrap={false}
              />
              <OnChangePlugin onChange={handleEditorChange} />
            </div>
          </LexicalComposer>
        </div>

        <div className="custom-prompt-container bg-card p-6 rounded-lg shadow-md w-2/5 ml-4">
          <CustomPrompt
            selectedText={editorText}
            onResult={(result) => setCustomPromptResult(result)}
          />
        </div>
      </div>
    </div>
  )
})

export default Editor