import React from 'react'
import { routes } from '../constants/routes'

export default function Logo({ admin = false, navigate }) {
  return (
    <button className="logo group" onClick={() => navigate?.(admin ? routes.dashboard : routes.landing)} aria-label="InternetDAT Track home">
      <span>InternetDAT</span>
      <b>{admin ? 'Admin' : 'Track'}</b>
    </button>
  )
}