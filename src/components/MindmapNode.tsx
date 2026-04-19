import type { Topic } from '../models'
import { CategorySection } from './CategorySection'

interface MindmapNodeProps {
  topic: Topic
  topicIndex: number
  onProblemToggle: (topicIndex: number, categoryIndex: number, problemId: number, newStatus: boolean) => void;
}

export function MindmapNode({ topic, topicIndex, onProblemToggle }: MindmapNodeProps) {
  const totalProblems = topic.categories.reduce((sum, cat) => sum + cat.problems.length, 0)
  const solvedProblems = topic.categories.reduce(
    (sum, cat) => sum + cat.problems.filter(p => p.solved).length,
    0,
  )
  const percentComplete = totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0

  return (
    <div className="mindmap-node">
      <div className="node-header">
        <div className="node-title">
          <h3>{topic.name}</h3>
          <p className="node-description">{topic.description}</p>
        </div>
        <div className="node-stats">
          <div className="node-progress-bar">
            <div className="node-progress-fill" style={{ width: `${percentComplete}%` }} />
          </div>
          <span className="node-count">
            {solvedProblems}/{totalProblems}
          </span>
        </div>
      </div>

      <div className="node-categories">
        {topic.categories.map((category, categoryIndex) => (
          <CategorySection
            key={category.name}
            category={category}
            onProblemToggle={(problemId, newStatus) => onProblemToggle(topicIndex, categoryIndex, problemId, newStatus)}
          />
        ))}
      </div>
    </div>
  )
}
