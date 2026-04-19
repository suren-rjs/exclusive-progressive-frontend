import { GoogleLogin, googleLogout } from '@react-oauth/google'
import { logoutFromBackend, signInWithGoogle } from '../utils/api'
import type { User } from '../models'

interface GoogleAuthProps {
  user: User | null
  onLoginSuccess: (user: User) => void
  onLogout: () => void
}

export function GoogleAuth({ user, onLoginSuccess, onLogout }: GoogleAuthProps) {
  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      // Sign in to backend with the ID Token, which sets httpOnly cookie
      const userData = await signInWithGoogle(credentialResponse.credential)

      if (userData) {
        onLoginSuccess(userData)
      }
    }
  }

  const handleLogout = async () => {
    await logoutFromBackend()
    googleLogout()
    onLogout()
  }
  return (
    <div className="google-auth">
      {user ? (
        <div className="user-profile">
          <img src={user.picture} alt={user.name} className="user-avatar" title={user.name} />
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log('Login Failed')}
          useOneTap
          shape="pill"
        />
      )}
    </div>
  )
}
