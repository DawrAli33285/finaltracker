import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AdminShell, CustomerShell } from './components/Layout'
import { routes } from './constants/routes'
import Landing from './pages/customer/Landing'
import TrackingResult from './pages/customer/TrackingResult'
import TrackingJourney from './pages/customer/TrackingJourney'
import MoreInfo from './pages/customer/MoreInfo'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import GenerateTracking from './pages/admin/GenerateTracking'
import OrderDetails from './pages/admin/OrderDetails'
import './styles.css'

function currentPath() {
  return window.location.pathname || '/'
}

function navigateTo(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

function App() {
  const [path, setPath] = useState(currentPath())

  useEffect(() => {
    const onPop = () => setPath(currentPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (nextPath) => {
    navigateTo(nextPath)
    setPath(currentPath())
  }

  if (path === routes.result) return <CustomerShell active="track" navigate={navigate}><TrackingResult navigate={navigate} /></CustomerShell>
  if (path === routes.journey) return <CustomerShell active="track" navigate={navigate}><TrackingJourney navigate={navigate} /></CustomerShell>
  if (path === routes.more) return <CustomerShell active="more" navigate={navigate}><MoreInfo navigate={navigate} /></CustomerShell>
  if (path === routes.login) return <AdminShell navigate={navigate}><AdminLogin navigate={navigate} /></AdminShell>
  if (path === routes.dashboard) return <AdminShell navigate={navigate}><Dashboard navigate={navigate} /></AdminShell>
  if (path === routes.generate) return <AdminShell navigate={navigate}><GenerateTracking navigate={navigate} /></AdminShell>
  if (path === routes.order) return <AdminShell navigate={navigate}><OrderDetails navigate={navigate} /></AdminShell>
  return <CustomerShell active="home" navigate={navigate}><Landing navigate={navigate} /></CustomerShell>
}

createRoot(document.getElementById('root')).render(<App />)