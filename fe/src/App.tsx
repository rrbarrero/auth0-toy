import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginButton from './components/LoginButton'
import LogoutButton from './components/LogoutButton'
import Profile from './components/Profile'
import AdminProfile from './components/AdminProfile'

function App() {
  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>React+Auth0</h1>
      <div className='card'>
        <Profile />
      </div>
      <div className='card'>
        <Profile />
      </div>
      <AdminProfile />
      <div className='card'>
        <LoginButton />
        <LogoutButton />
      </div>
    </>
  )
}

export default App
