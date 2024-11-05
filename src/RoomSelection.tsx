// src/RoomSelection.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface RoomSelectionProps {
  username: string | null
}

const generateRoomId = () => Math.random().toString(36).substr(2, 9)

const RoomSelection: React.FC<RoomSelectionProps> = ({ username }) => {
  const [roomId, setRoomId] = useState<string>('')
  const [generatedRoomId, setGeneratedRoomId] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId()
    setGeneratedRoomId(newRoomId)
    setRoomId(newRoomId)
  }

  const handleCopyRoomId = () => {
    if (generatedRoomId) {
      navigator.clipboard.writeText(generatedRoomId)
      alert('Room ID copied to clipboard!')
    }
  }

  const handleJoinRoom = () => {
    if (roomId) {
      navigate(`/editor/${roomId}`, { state: { username } }) // Pass username as state
    } else {
      alert('Please enter a room ID to join')
    }
  }

  return (
    <div>
      <h2>Select a Room</h2>

      <div>
        <h3>Create a New Room</h3>
        <button onClick={handleCreateRoom}>Generate Room ID</button>
        {generatedRoomId && (
          <div>
            <p>Room ID: {generatedRoomId}</p>
            <button onClick={handleCopyRoomId}>Copy Room ID</button>
          </div>
        )}
      </div>

      <div>
        <h3>Join an Existing Room</h3>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
    </div>
  )
}

export default RoomSelection
