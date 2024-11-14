import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { Provider } from '@lexical/yjs'
import { $createParagraphNode, $getRoot } from 'lexical'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { db,auth } from './firebase'
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  collection,getDoc
} from 'firebase/firestore'

import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { FaDownload } from 'react-icons/fa6'
import CustomPrompt from './CustomPrompt'
import ExampleTheme from './ExampleTheme'
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
  const initialUsername = location.state?.username

  const [customPromptResult, setCustomPromptResult] = useState<string>('')
  const [editorText, setEditorText] = useState<string>('')
  const providerRef = useRef<Provider | null>(null)
  const username = useRef(initialUsername)
  const [collaborators, setCollaborators] = useState<
    { username: string; userId: string }[]
  >([])

  const handleEditorChange = (editorState: any) => {
    editorState.read(() => {
      const root = $getRoot()
      const textContent = root.getTextContent()
      setEditorText(textContent)
    })
  }

  const handleDownload = () => {
    const blob = new Blob([editorText], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'editor-content.txt'
    a.click()
    window.URL.revokeObjectURL(url)
  }

const addCollaboratorToFirestore = async () => {
  if (!initialUsername) return // Avoid adding "Anonymous" users

  const collaboratorRef = doc(
    db,
    'rooms',
    roomId!,
    'collaborators',
    initialUsername
  )

  try {
    // Only set the document if it doesn’t already exist
    await setDoc(
      collaboratorRef,
      {
        username: initialUsername,
        userId: auth.currentUser?.uid,
        lastActive: serverTimestamp(),
      },
      { merge: true }
    ) // Use merge to avoid overwriting if it exists
  } catch (error) {
    console.error('Error adding collaborator:', error)
  }
}


  const removeCollaboratorFromFirestore = async () => {
    const collaboratorRef = doc(
      db,
      'rooms',
      roomId!,
      'collaborators',
      initialUsername
    )
    await deleteDoc(collaboratorRef)
  }
useEffect(() => {
  addCollaboratorToFirestore()

  const interval = setInterval(async () => {
    const collaboratorRef = doc(
      db,
      'rooms',
      roomId!,
      'collaborators',
      initialUsername
    )
    try {
      // Check if the document exists
      const docSnap = await getDoc(collaboratorRef)
      if (docSnap.exists()) {
        await updateDoc(collaboratorRef, { lastActive: serverTimestamp() })
      }
    } catch (error) {
      console.error("Error updating collaborator's lastActive:", error)
    }
  }, 10000) // Update every 10 seconds

  return () => {
    removeCollaboratorFromFirestore()
    clearInterval(interval)
  }
}, [roomId, initialUsername])


  useEffect(() => {
    const collaboratorsRef = collection(db, 'rooms', roomId!, 'collaborators')
    const unsubscribe = onSnapshot(collaboratorsRef, (snapshot) => {
      const updatedCollaborators = snapshot.docs.map((doc) => ({
        userId: doc.id,
        username: doc.data().username || 'Unknown', // Default to 'Unknown' if 'username' is not available
      })) as { username: string; userId: string }[]
      setCollaborators(updatedCollaborators)
    })

    return () => unsubscribe()
  }, [roomId])


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
        <div className="text-sm text-textSecondary mt-2">
          <strong>Collaborators:</strong>
          {collaborators
            .filter((collaborator) => collaborator.username !== 'Anonymous') // Filter out "Anonymous"
            .map((collaborator) => (
              <span key={collaborator.userId} className="ml-2">
                {collaborator.username}
              </span>
            ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full lg:space-x-4 space-y-4 lg:space-y-0">
        <div className="editor-section bg-card p-6 rounded-lg shadow-md w-full lg:w-3/5 flex flex-col min-h-[70vh] max-h-[70vh]">
          <LexicalComposer initialConfig={editorConfig}>
            <ToolbarPlugin />
            <div className="editor-inner flex-grow overflow-y-auto h-[70vh]">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input border p-4 rounded-md h-full max-h-[60vh] overflow-y-auto" />
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

          <div className="flex justify-end mt-4">
            <button
              onClick={handleDownload}
              className="p-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-90 focus:outline-none"
              aria-label="Download content"
            >
              <FaDownload className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="custom-prompt-container bg-card p-6 rounded-lg shadow-md w-full lg:w-2/5 min-h-[30vh] lg:min-h-[70vh] overflow-y-auto">
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
