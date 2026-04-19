import type { Category } from '../models'
import { ProblemItem } from './ProblemItem'

interface CategorySectionProps {
  category: Category
  onProblemToggle: (problemId: number, newStatus: boolean) => void
}

export function CategorySection({ category, onProblemToggle }: CategorySectionProps) {
  const sectionClass = category.unlocked ? 'category' : 'category locked'

  return (
    <div className={sectionClass}>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <ul>
        {category.problems.map(problem => (
          <ProblemItem
            key={problem.id}
            problem={problem}
            disabled={!category.unlocked}
            onToggle={(newStatus) => onProblemToggle(problem.id, newStatus)}
          />
        ))}
      </ul>
    </div>
  )
}
