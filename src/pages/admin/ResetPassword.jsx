import React, { useState } from 'react'
import { KeyRound, LockKeyhole, Mail } from 'lucide-react'
import { routes } from '../../constants/routes'
import { forgotPassword, resetPassword } from '../../api/client'

export default function ResetPassword({ navigate }) {
  const [step, setStep] = useState(1) 
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const sendCode = async (event) => {
    event?.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setInfo('A 6-digit code has been sent to your email.')
      setStep(2)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const submitReset = async (event) => {
    event.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await resetPassword({ email, otp, newPassword })
      navigate(routes.login)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-auth-page">
      <div className="auth-card">
        <div className="auth-mark"><KeyRound size={28} /></div>
        <h1>Reset password</h1>
        <p>{step === 1 ? 'Enter your admin email to receive a code' : 'Enter the code and your new password'}</p>

        {step === 1 ? (
          <form onSubmit={sendCode}>
            <label>Email address</label>
            <div className="admin-input">
              <Mail size={16} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {error && <span className="form-error">{error}</span>}
            <button className="primary-button my-[2rem] auth-submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitReset}>
            {info && <p>{info}</p>}
            <label>6-digit code</label>
            <div className="admin-input">
              <KeyRound size={16} />
              <input
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            <label>New password</label>
            <div className="admin-input">
              <LockKeyhole size={16} />
              <input
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            {error && <span className="form-error">{error}</span>}
            <button className="primary-button my-[2rem] auth-submit" disabled={loading}>
              {loading ? 'Updating…' : 'Reset password'}
            </button>
            <button type="button" onClick={sendCode} disabled={loading}>Resend code</button>
          </form>
        )}
      </div>
      <div className="auth-foot">
        <button type="button" onClick={() => navigate(routes.login)}>Back to login</button>
      </div>
    </section>
  )
}