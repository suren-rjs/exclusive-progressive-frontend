import type { Topic } from '../models'

const STORAGE_KEY = 'dsa-roadmap-state'

export function loadSavedTopics(): Topic[] | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Topic[]) : null
  } catch {
    return null
  }
}

export function saveTopics(topics: Topic[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(topics))
  } catch {
    // ignore storage errors
  }
}
