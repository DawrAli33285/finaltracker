import React, { useState } from 'react'
import { ArrowRight, LockKeyhole, Package, UserRound } from 'lucide-react'
import { routes } from '../../constants/routes'
import { login, setToken } from '../../api/client'

export default function AdminLogin({ navigate }) {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await login({ email, password })
      setToken(token)
      navigate(routes.dashboard)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
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
              required
            />
          </div>
          <label>Password</label>
          <div className="admin-input">
            <LockKeyhole size={16} />
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
          </div>
          {error && <span className="form-error">{error}</span>}
          <label className="remember"><input type="checkbox" defaultChecked /> <span>Remember me</span></label>
          <button className="primary-button auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'} {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
      <div className="auth-foot">Secure <span>•</span> Reliable <span>•</span> Internal Use Only</div>
    </section>
  )
}