const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Centralized fetch with credentials
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
    }
  })
}

export async function signInWithGoogle(idToken: string) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    })
    
    if (!response.ok) {
      throw new Error('Failed to sign in with Google')
    }
    
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Sign in error:', error)
    return null
  }
}

export async function logoutFromBackend() {
  try {
    await fetchWithAuth(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST'
    })
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/me`)
    if (response.ok) {
      const data = await response.json()
      return data.user
    }
  } catch (error) {
    // Silence error for session check
  }
  return null
}

export async function getTopicsFromBackend() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/topics`)
    if (!response.ok) {
      throw new Error('Failed to fetch topics')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching topics:', error)
    return null
  }
}

export async function saveProgressToBackend(topics: any) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/progress/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topics })
    })
    
    if (!response.ok) {
      throw new Error('Failed to save progress to backend')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error saving progress:', error)
  }
}

export async function getProgressFromBackend() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/progress`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch progress from backend')
    }
    
    const data = await response.json()
    return data.solvedProblems
  } catch (error) {
    console.error('Error fetching progress:', error)
    return null
  }
}

export async function getNotificationsFromBackend() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/notifications`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
}

export async function toggleProblemInBackend(problemId: number, solved: boolean) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/progress/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ problemId, solved })
    })
    
    if (!response.ok) {
      throw new Error('Failed to toggle problem status')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error toggling problem:', error)
  }
}

export async function getAdminUsers() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/users`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch admin users')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
}

export async function exportAdminData() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/export`)
    
    if (!response.ok) {
      throw new Error('Failed to export data')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users_progress.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch (error) {
    console.error('Error exporting data:', error)
  }
}
