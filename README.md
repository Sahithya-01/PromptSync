# Link: https://promptsync.netlify.app/

Demo: https://www.loom.com/share/4c26b1525a674bb8bd22a8dee3b2735a?sid=905ac361-1acb-42b0-9733-77db54ff7df4

# PromptSync: Real-Time Collaborative Text Editor

PromptSync is a web-based collaborative text editor that brings together real-time editing, presence indicators, and AI-driven insights for enhanced teamwork. Built with React, Firebase, Yjs, and Google Generative AI, this editor is designed for teams needing a rich-text environment with on-demand content analysis.

## Features

- **Real-Time Collaboration**: Edit documents simultaneously with your team, with live indicators showing who’s online and active in the document.
- **User Authentication**: Secure registration and login through Firebase Authentication.
- **Room-Based Collaboration**: Create unique collaboration spaces (rooms) where users can join, edit, and share documents.
- **AI-Powered Prompts**: Generate responses from Google Generative AI for custom prompts directly related to the editor’s content.
- **Persistent Room History**: Access a history of previously joined rooms, allowing users to quickly revisit past collaborative work.
- **Content Downloading**: Save your work offline with a one-click download feature for current document content.
- **Dark/Light Mode**: Switch between themes for a comfortable editing experience in various lighting conditions.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Rich Text Editor**: Lexical for advanced text editing
- **Real-Time Collaboration**: Yjs (CRDT) with WebSocket provider
- **Authentication and Data Storage**: Firebase Authentication and Firestore
- **AI Integration**: Google Generative AI for content-specific insights


## Setup Instructions

### Prerequisites

- Node.js and npm
- Firebase project with Firestore and Authentication enabled
- Google Cloud project with Generative AI API enabled

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/promptsync.git
   cd promptsync
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**: Set up environment variables by creating a `.env` file in the root directory and adding the following keys:
   ```bash
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_google_generative_ai_api_key
   ```

4. **Firebase Initialization**: Update `firebase.js` with your Firebase project configuration.

### Running the Application

Start the development server:
   ```bash
   npm run dev
   ```

## Core Features and How They Work

### 1. **User Authentication**
   - Firebase Authentication is used to manage secure sign-in and sign-up processes.
   - `AuthProvider` component supplies user context across the app, ensuring that routes like `/editor` and `/rooms` are protected.

### 2. **Room Management**
   - **Room Creation**: Users can create new rooms by generating a unique Room ID or setting a custom ID.
   - **Room History**: Each user’s room history is stored in Firestore under the user's document, enabling easy access to previous sessions.
   - **Firestore Structure**:
     - User document: Stores room history under `users/{userId}/rooms`.
     - Room document: Stores room-specific data and collaborators under `rooms/{roomId}`.

### 3. **Collaborative Editor**
   - **Lexical** is used for text editing, enabling rich-text formatting and on-change tracking.
   - **Yjs CRDT** with WebSocket ensures synchronized document editing across users.
   - **Firestore Integration**: Each room contains a list of collaborators with metadata, including `lastActive` timestamp, allowing for active user detection.
   
### 4. **AI-Powered Custom Prompts**
   - **Google Generative AI** processes custom prompts based on the selected editor content.
   - **Usage**: Users can type a question or command (e.g., “Summarize this” or “Explain the importance of X”) in the `CustomPrompt` component to receive AI-generated responses.
   - **Integration**: The AI prompt API is accessed in `CustomPrompt.tsx`, which displays the results in a designated panel.

### 5. **Presence Detection**
   - Presence tracking of collaborators within a room is achieved using Firestore, where each user’s `lastActive` timestamp is updated every 10 seconds.
   - A list of active collaborators is displayed in the editor interface, offering real-time visibility into who is working in the room.

### 6. **Dark and Light Theme**
   - A toggle component allows users to switch between dark and light themes. The styling is handled using Tailwind CSS, ensuring that each theme is applied uniformly across the app.

### 7. **Content Downloading**
   - Users can download the current content in the editor as a `.txt` file, enabling offline access to their work.
   - This is implemented using a Blob object, allowing the editor content to be saved locally with a simple click.

## Detailed Firestore Document Layout

- **Users Collection**: 
  ```
  users/
  └── {userId}
      ├── username: string
      ├── email: string
      └── rooms: array of room IDs
  ```

- **Rooms Collection**:
  ```
  rooms/
  └── {roomId}
      ├── roomId: string
      └── collaborators/
          └── {collaboratorUsername}
              ├── username: string
              ├── userId: string
              └── lastActive: timestamp
  ```

## Example Usage of Custom Prompts

1. **Summarize a Passage**: Select a paragraph in the editor, enter the prompt “Summarize this section,” and receive a concise summary from the AI.
2. **Ask Specific Questions**: After selecting text, ask, “What are the main takeaways?” to generate key insights based on the content.

## Error Handling

- **Authentication Errors**: Users are informed of incorrect credentials on the login screen.
- **Firestore Permissions**: Firestore rules restrict unauthorized data access. Ensure Firestore security rules are configured for your project.
- **Connection Errors**: The WebSocket connection is checked to ensure real-time collaboration continuity, and users are alerted if disconnected.
