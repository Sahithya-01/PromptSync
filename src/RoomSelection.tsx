import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { db } from './firebase'

interface RoomSelectionProps {
  username: string | null
  userId: string | null
}

const generateRoomId = () => Math.random().toString(36).substr(2, 9)

const RoomSelection: React.FC<RoomSelectionProps> = ({ username, userId }) => {
  const [roomId, setRoomId] = useState('')
  const [generatedRoomId, setGeneratedRoomId] = useState<string | null>(null)
  const [roomHistory, setRoomHistory] = useState<string[]>([])
  const [customRoomId, setCustomRoomId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRoomHistory = async () => {
      if (!userId) return
      try {
        const roomsRef = collection(db, 'users', userId, 'rooms')
        const roomsSnapshot = await getDocs(roomsRef)
        setRoomHistory(roomsSnapshot.docs.map((doc) => doc.id))
      } catch (error) {
        console.error('Error fetching room history:', error)
      }
    }
    fetchRoomHistory()
  }, [userId])

  const handleCreateRoom = async () => {
    const newRoomId = customRoomId || generateRoomId()
    setGeneratedRoomId(newRoomId)
    setRoomId(newRoomId)

    if (userId) {
      try {
        const roomDocRef = doc(db, 'users', userId, 'rooms', newRoomId)
        await setDoc(roomDocRef, { roomId: newRoomId })
        setRoomHistory((prev) => [...prev, newRoomId])
      } catch (error) {
        console.error('Error creating room:', error)
      }
    }
    setCustomRoomId('')
  }

  const handleCopyRoomId = () => {
    if (generatedRoomId) {
      navigator.clipboard.writeText(generatedRoomId)
      alert('Room ID copied to clipboard!')
    }
  }

  const handleJoinRoom = () => {
    if (!roomId) return alert('Please enter a room ID to join')
    navigate(`/editor/${roomId}`, { state: { username } })
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary p-6 flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-6">Select a Room</h2>
      <ThemeToggle />

      <div className="w-full max-w-md space-y-6">
        {/* Create Room Section */}
        <RoomSection
          title="Create a New Room"
          buttonLabel="Generate Room ID"
          inputValue={customRoomId}
          onInputChange={(e) => setCustomRoomId(e.target.value)}
          onButtonClick={handleCreateRoom}
        />
        {generatedRoomId && (
          <GeneratedRoom id={generatedRoomId} onCopy={handleCopyRoomId} />
        )}

        {/* Join Room Section */}
        <RoomSection
          title="Join an Existing Room"
          buttonLabel="Join Room"
          inputValue={roomId}
          onInputChange={(e) => setRoomId(e.target.value)}
          onButtonClick={handleJoinRoom}
        />

        {/* Room History Section */}
        {roomHistory.length > 0 && (
          <RoomHistory
            rooms={roomHistory}
            onSelect={(room) => setRoomId(room)}
          />
        )}
      </div>
    </div>
  )
}

// Sub-components

const RoomSection: React.FC<{
  title: string
  buttonLabel: string
  inputValue: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onButtonClick: () => void
}> = ({ title, buttonLabel, inputValue, onInputChange, onButtonClick }) => (
  <div className="bg-card p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <input
      type="text"
      placeholder="Enter custom Room ID (optional)"
      value={inputValue}
      onChange={onInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <button
      onClick={onButtonClick}
      className="w-full py-2 text-white rounded-md bg-primary hover:bg-opacity-90 focus:outline-none"
    >
      {buttonLabel}
    </button>
  </div>
)

const GeneratedRoom: React.FC<{ id: string; onCopy: () => void }> = ({
  id,
  onCopy,
}) => (
  <div className="text-center mt-4">
    <p className="font-medium text-lg">Room ID: {id}</p>
    <button
      onClick={onCopy}
      className="mt-2 text-accent hover:underline focus:outline-none"
    >
      Copy Room ID
    </button>
  </div>
)

const RoomHistory: React.FC<{
  rooms: string[]
  onSelect: (room: string) => void
}> = ({ rooms, onSelect }) => (
  <div className="bg-card p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold mb-4">Room History</h3>
    <ul className="space-y-2">
      {rooms.map((room) => (
        <li key={room} className="flex justify-between items-center">
          <span className="text-lg">{room}</span>
          <button
            onClick={() => onSelect(room)}
            className="text-accent hover:underline focus:outline-none"
          >
            Join
          </button>
        </li>
      ))}
    </ul>
  </div>
)

export default RoomSelection
