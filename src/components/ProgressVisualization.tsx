import type { Topic } from '../models'

interface ProgressVisualizationProps {
  topics: Topic[]
}

export function ProgressVisualization({ topics }: ProgressVisualizationProps) {
  const totalProblems = topics.reduce(
    (sum, topic) => sum + topic.categories.reduce((s, cat) => s + cat.problems.length, 0),
    0,
  )
  const solvedProblems = topics.reduce(
    (sum, topic) =>
      sum +
      topic.categories.reduce((s, cat) => s + cat.problems.filter(p => p.solved).length, 0),
    0,
  )
  const remainingProblems = totalProblems - solvedProblems
  const percentComplete = totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0

  return (
    <aside className="progress-panel">
      <div className="progress-card">
        <h3>Overall Progress</h3>

        <div className="progress-circle">
          <svg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" className="progress-bg" />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="circle-progress-fill"
              style={{
                strokeDasharray: `${(percentComplete / 100) * 282.7} 282.7`,
              }}
            />
          </svg>
          <div className="progress-text">
            <span className="percent">{Math.round(percentComplete)}%</span>
            <span className="label">Complete</span>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-label">Problems Solved</span>
            <span className="stat-value">{solvedProblems}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Remaining</span>
            <span className="stat-value">{remainingProblems}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{totalProblems}</span>
          </div>
        </div>

        <div className="progress-by-topic">
          <h4>By Topic</h4>
          <ul>
            {topics.map(topic => {
              const topicTotal = topic.categories.reduce((sum, cat) => sum + cat.problems.length, 0)
              const topicSolved = topic.categories.reduce(
                (sum, cat) => sum + cat.problems.filter(p => p.solved).length,
                0,
              )

              return (
                <li key={topic.name}>
                  <span className="topic-name">{topic.name}</span>
                  <span className="topic-count">
                    {topicSolved}/{topicTotal}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </aside>
  )
}
