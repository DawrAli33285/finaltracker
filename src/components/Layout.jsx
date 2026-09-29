import React, { useState } from 'react'
import { ArrowUpRight, LogOut, Menu, ShieldCheck, UserRound } from 'lucide-react'
import Logo from './Logo'
import { routes } from '../constants/routes'
import { logout } from '../api/client'


export function CustomerShell({ children, active, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const goTo = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="site-header">
        <div className="shell header-inner">
          <Logo navigate={navigate} />
          <nav className="desktop-nav" aria-label="Main navigation">
            <button className={active === 'home' ? 'nav-active' : ''} onClick={() => navigate(routes.landing)}>Track Shipment</button>
            <button className={active === 'more' ? 'nav-active' : ''} onClick={() => navigate(routes.more)}>About Bulk Shipments</button>
          
          </nav>
          <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={21} /></button>
        </div>
        {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">
          <button className={active === 'home' ? 'nav-active' : ''} onClick={() => goTo(routes.landing)}>Track Shipment</button>
          <button className={active === 'more' ? 'nav-active' : ''} onClick={() => goTo(routes.more)}>About Bulk Shipments</button>

        </nav>}
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <div><Logo navigate={navigate} /><p>For support, email <a href="mailto:support@internetdat.com">support@internetdat.com</a></p></div>
          <div className="footer-badges"><span><ShieldCheck size={16} /> Verified Logistics Partner</span><span>© 2026 InternetDAT</span></div>
        </div>
      </footer>
    </div>
  )
}

export function AdminShell({ children, navigate, hideAuth }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    setMenuOpen(false)
    logout() 
    navigate(routes.login)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="site-header admin-header">
        <div className="shell header-inner">
          <Logo admin navigate={navigate} />
          <div className="admin-header-right">
            <span className="admin-user"><UserRound size={16} /> Admin Portal</span>
            {!hideAuth && (
              <button className="icon-button" aria-label="Sign out" title="Sign out" onClick={handleLogout}>
                <LogOut size={18} />
              </button>
            )}
            <button className="icon-button" aria-label={menuOpen ? 'Close admin menu' : 'Open admin menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
        {menuOpen && <nav className="mobile-nav admin-mobile-nav" aria-label="Admin mobile navigation">
          <button onClick={() => { setMenuOpen(false); navigate(routes.dashboard) }}>Dashboard</button>
          <button onClick={() => { setMenuOpen(false); navigate(routes.orders) }}>All Orders</button>
          <button onClick={() => { setMenuOpen(false); navigate(routes.resetPassword) }}>Reset password</button>
          {!hideAuth && <button onClick={handleLogout}>Sign out</button>}
        </nav>}
      </header>
      <main>{children}</main>
    </div>
  )
}