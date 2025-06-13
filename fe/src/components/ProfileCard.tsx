import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import AuthApiClient from '../infra/backendRepo'

interface Props {
  title: string
  /** receives an AuthApiClient and must return the backend JSON */
  fetcher: (client: AuthApiClient) => Promise<unknown>
  /** if true, shows the card only when role === 'admin' */
  requireAdmin?: boolean
}

export default function ProfileCard({ title, fetcher, requireAdmin = false }: Props) {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  // tiny helper to know if the logged user is admin
  const isAdmin = (user as any)?.['http://localhost:3000/role'] === 'admin' // custom claim

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || (requireAdmin && !isAdmin)) return
      try {
        const token = await getAccessTokenSilently()
        const api = new AuthApiClient('http://localhost:8001', token)
        const res = await fetcher(api)
        setData(res)
      } catch (e: any) {
        setError(e.message ?? 'Unknown error')
      }
    }
    run()
  }, [isAuthenticated, isAdmin])

  if (isLoading) return <section className='card'>Loading …</section>
  if (!isAuthenticated) return <section className='card'>Please log in first.</section>
  if (requireAdmin && !isAdmin) return <section className='card'>Only admins can see this card.</section>

  return (
    <section className='card'>
      <h2>{title}</h2>
      <img className='avatar' src={user?.picture} alt={user?.name} />
      <p className='name'>{user?.name}</p>
      <p className='email'>{user?.email}</p>

      <pre>{data ? JSON.stringify(data, null, 2) : 'Loading backend data…'}</pre>
      {error && <p className='error'>{error}</p>}
    </section>
  )
}
