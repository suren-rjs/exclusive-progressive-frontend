import type { Problem } from '../models'

interface ProblemItemProps {
  problem: Problem
  disabled: boolean
  onToggle: (newStatus: boolean) => void
}

export function ProblemItem({ problem, disabled, onToggle }: ProblemItemProps) {
  return (
    <li className="problem-item">
      <label>
        <input
          type="checkbox"
          checked={problem.solved}
          disabled={disabled}
          onChange={() => onToggle(!problem.solved)}
        />
        <span>
          {problem.id}. {problem.title} ({problem.difficulty})
        </span>
      </label>
      <a href={problem.url} target="_blank" rel="noopener noreferrer">
        View
      </a>
    </li>
  )
}
