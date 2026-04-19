import { useState, useEffect } from 'react'
import { getAdminUsers, exportAdminData } from '../utils/api'

export function AdminView() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await getAdminUsers()
      setUsers(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const countSolved = (topics: any) => {
    let count = 0
    topics?.forEach((t: any) => t.categories.forEach((c: any) => c.problems.forEach((p: any) => p.solved && count++)))
    return count
  }

  if (loading) return <div>Loading admin data...</div>

  return (
    <div className="admin-view">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={exportAdminData} className="export-button">Export CSV</button>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Problems Solved</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{countSolved(user.topics)}</td>
                <td>{new Date(user.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
