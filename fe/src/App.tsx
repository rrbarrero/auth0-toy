import { useAuth0 } from '@auth0/auth0-react'
import './styles.css'
import ProfileCard from './components/ProfileCard'

export default function App() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0()

  return (
    <main>
      <h1>Auth0 + FastAPI PoC</h1>

      <div className='grid'>
        <ProfileCard title='User Profile' fetcher={api => api.getPrivateData()} />

        <ProfileCard title='Admin Profile (claim admin)' fetcher={api => api.getScopedAdmin()} requireAdmin />
      </div>

      <div className='actions'>
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Log in</button>
        ) : (
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log out</button>
        )}
      </div>
    </main>
  )
}
