import React, { useState } from 'react'
import { Lock } from 'lucide-react'
import { routes } from '../../constants/routes'
import { changePassword } from '../../api/client'

export default function ChangePassword({ navigate }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (newPassword.length < 8) return setError('New password must be at least 8 characters.')
    if (newPassword !== confirm) return setError('Passwords do not match.')
    setSaving(true)
    try {
      await changePassword({ currentPassword, newPassword })
      setDone(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="admin-auth-page">
      <div className="auth-card">
        <div className="auth-mark"><Lock size={24} /></div>
        <h1>Change Password</h1>
        <p>{done ? 'Your password has been updated.' : 'Enter your current password and a new one.'}</p>

        {done ? (
          <button className="primary-button auth-submit" onClick={() => navigate(routes.dashboard)}>
            Back to dashboard
          </button>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="cp-current">Current password</label>
            <div className="admin-input">
              <input id="cp-current" type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>

            <label htmlFor="cp-new">New password</label>
            <div className="admin-input">
              <input id="cp-new" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>

            <label htmlFor="cp-confirm">Confirm new password</label>
            <div className="admin-input">
              <input id="cp-confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>

            {error && <span className="form-error">{error}</span>}
            <button type="submit" className="primary-button auth-submit" style={{ marginTop: 20 }} disabled={saving}>
              {saving ? 'Updating…' : 'Update password'}
            </button>
            <button type="button" className="forgot" onClick={() => navigate(routes.dashboard)}>Cancel</button>
          </form>
        )}
      </div>
    </section>
  )
}