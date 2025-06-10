import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import AuthApiClient from '../infra/backendRepo'

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [userMetadata, setUserMetadata] = useState<Record<string, unknown> | null>(null)
  const [userToken, setUserToken] = useState<string>('')
  const [loadingMetadata, setLoadingMetadata] = useState<boolean>(true)
  const [errorMetadata, setErrorMetadata] = useState<string | null>(null)

  const [backendData, setBackendData] = useState<Record<string, unknown> | null>(null)
  const [backendLoading, setBackendLoading] = useState<boolean>(false)
  const [backendError, setBackendError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserAndToken = async () => {
      if (!isAuthenticated || !user?.sub) {
        setLoadingMetadata(false)
        return
      }

      setLoadingMetadata(true)
      setErrorMetadata(null)

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUDIENCE,
            scope: 'read:current_user',
          },
        })

        const userDetailsByIdUrl = `https://${import.meta.env.VITE_DOMAIN}/api/v2/users/${user.sub}`

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const { user_metadata } = await metadataResponse.json()

        setUserMetadata(user_metadata)
        setUserToken(accessToken)
        console.log('token', accessToken)
      } catch (e: any) {
        console.error('Error fetching user metadata or token:', e.message || e)
        setErrorMetadata(e.message || 'Unknown error fetching metadata.')
      } finally {
        setLoadingMetadata(false)
      }
    }

    fetchUserAndToken()
  }, [getAccessTokenSilently, isAuthenticated, user?.sub])

  useEffect(() => {
    const fetchBackendData = async () => {
      if (!isAuthenticated || !userToken) {
        setBackendLoading(false)
        return
      }

      setBackendLoading(true)
      setBackendError(null)

      try {
        const apiClient = new AuthApiClient('http://localhost:8001', userToken)
        const data = await apiClient.getPrivateData()
        setBackendData(data as Record<string, unknown>)
      } catch (e: any) {
        console.error('Error fetching backend data:', e.message || e)
        setBackendError(e.message || 'Unknown error fetching backend data.')
      } finally {
        setBackendLoading(false)
      }
    }

    fetchBackendData()
  }, [isAuthenticated, userToken])

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div>
      <img src={user?.picture} alt={user?.name} />
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>

      <h3>User Metadata (from Auth0)</h3>
      {loadingMetadata ? (
        <p>Loading metadata...</p>
      ) : errorMetadata ? (
        <p style={{ color: 'red' }}>Error: {errorMetadata}</p>
      ) : userMetadata ? (
        <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
      ) : (
        'No user metadata defined.'
      )}

      <h3>Private Data (from Backend FastAPI)</h3>
      {backendLoading ? (
        <p>Loading backend data...</p>
      ) : backendError ? (
        <p style={{ color: 'red' }}>Error: {backendError}</p>
      ) : backendData ? (
        <pre>{JSON.stringify(backendData, null, 2)}</pre>
      ) : (
        'No backend data loaded.'
      )}
    </div>
  )
}

export default Profile
