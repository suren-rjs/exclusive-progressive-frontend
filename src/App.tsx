import { useState } from 'react'
import './index.css'
import { MindmapNode } from './components/MindmapNode'
import { ProgressVisualization } from './components/ProgressVisualization'
import { GoogleAuth } from './components/GoogleAuth'
import { AdminView } from './components/AdminView'
import { useAuth } from './context/AuthContext'
import { useTopics } from './context/TopicContext'
import { useNotifications } from './context/NotificationContext'

const ADMIN_EMAILS = ['suren.rjs@gmail.com']

function App() {
  const { user, loading: authLoading, setUser, logout } = useAuth()
  const { topics, loading: topicsLoading, handleProblemToggle } = useTopics()
  const { notifications, removeNotification } = useNotifications()
  const [showAdmin, setShowAdmin] = useState(false)

  const isAdmin = user && ADMIN_EMAILS.includes(user.email)

  const clearNotification = (index: number) => {
      removeNotification(index)
  }

  if (authLoading || topicsLoading) return <div className="loading">Loading...</div>

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-info">
            <h1>🧠 DSA Roadmap for your next interview</h1>
            <p>Master Data Structures and Algorithms through structured problem-solving. Progress is saved automatically.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isAdmin && (
                <button 
                    onClick={() => setShowAdmin(!showAdmin)} 
                    className="logout-button"
                    style={{ background: showAdmin ? 'white' : 'rgba(255,255,255,0.2)', color: showAdmin ? '#667eea' : 'white' }}
                >
                    {showAdmin ? 'View Roadmap' : 'Admin Panel'}
                </button>
            )}
            <GoogleAuth 
                user={user} 
                onLoginSuccess={setUser} 
                onLogout={logout} 
            />
          </div>
        </div>
      </header>

      {notifications.length > 0 && (
          <div className="notifications-container">
              {notifications.map((notif, idx) => (
                  <div key={idx} className="notification-toast">
                      <span>{notif.message}</span>
                      <button onClick={() => clearNotification(idx)}>×</button>
                  </div>
              ))}
          </div>
      )}

      <div className="main-container">
        {showAdmin && isAdmin ? (
            <AdminView />
        ) : (
            <>
                <main className="mindmap-container">
                {topics.map((topic, topicIndex) => (
                    <MindmapNode
                    key={topic.name}
                    topic={topic}
                    topicIndex={topicIndex}
                    onProblemToggle={handleProblemToggle}
                    />
                ))}
                </main>
                <ProgressVisualization topics={topics} />
            </>
        )}
      </div>
    </div>
  )
}

export default App
