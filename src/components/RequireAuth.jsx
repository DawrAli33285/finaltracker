import React, { useEffect } from 'react'
import { getToken } from '../api/client'
import { routes } from '../constants/routes'

export default function RequireAuth({ navigate, children }) {
  const token = getToken()

  useEffect(() => {
    if (!token) navigate(routes.login)
  }, [token, navigate])

  return token ? children : null
}