import React, { useState } from 'react'
import { ArrowRight, LockKeyhole, Package, UserRound } from 'lucide-react'
import { routes } from '../../constants/routes'

const ADMIN_EMAIL = 'admin@internetdat.com'
const ADMIN_PASSWORD = 'password'

export default function AdminLogin({ navigate }) {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      navigate(routes.dashboard)
    } else {
      setError('Incorrect email or password.')
    }
  }

  return (
    <section className="admin-auth-page">
      <div className="auth-card">
        <div className="auth-mark"><Package size={28} /></div>
        <h1>Welcome Back</h1>
        <p>Sign in to your admin account</p>
        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <div className="admin-input">
            <UserRound size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@internetdat.com"
            />
          </div>
          <label>Password</label>
          <div className="admin-input">
            <LockKeyhole size={16} />
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <label className="remember"><input type="checkbox" defaultChecked /> <span>Remember me</span></label>
          <button className="primary-button auth-submit">
            Login <ArrowRight size={16} />
          </button>
        </form>
        
      </div>
      <div className="auth-foot">Secure <span>•</span> Reliable <span>•</span> Internal Use Only</div>
    </section>
  )
}