// src/Editor.tsx
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { Provider } from '@lexical/yjs'
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical'
import React from 'react'
import { useParams } from 'react-router-dom'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import ExampleTheme from './ExampleTheme'
import PubNub from './PubNub'
import ToolbarPlugin from './plugins/ToolbarPlugin'

// Editor configuration
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

// Initialize editor state
function initialEditorState(): void {
  const root = $getRoot()
  const paragraph = $createParagraphNode()
  const text = $createTextNode('')
  paragraph.append(text)
  root.append(paragraph)
}

const Editor: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>()

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div id="yjs-collaboration-plugin-container" className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<span></span>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <CollaborationPlugin
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
    </LexicalComposer>
  )
}

export default Editor
