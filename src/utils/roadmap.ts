import type { Topic } from '../models'

export function toggleProblemSolved(
  topics: Topic[],
  topicIndex: number,
  categoryIndex: number,
  problemId: number,
): Topic[] {
  return topics.map((topic, currentTopicIndex) => {
    if (currentTopicIndex !== topicIndex) {
      return topic
    }

    const updatedCategories = topic.categories.map((category, currentCategoryIndex) => {
      if (currentCategoryIndex !== categoryIndex) {
        return category
      }

      const updatedProblems = category.problems.map(problem =>
        problem.id === problemId ? { ...problem, solved: !problem.solved } : problem,
      )

      return {
        ...category,
        problems: updatedProblems,
      }
    })

    const currentCategoryCompleted = updatedCategories[categoryIndex].problems.every(problem => problem.solved)

    return {
      ...topic,
      categories: updatedCategories.map((category, currentCategoryIndex) => {
        if (currentCategoryIndex === categoryIndex + 1) {
          return {
            ...category,
            unlocked: category.unlocked || currentCategoryCompleted,
          }
        }

        return category
      }),
    }
  })
}
