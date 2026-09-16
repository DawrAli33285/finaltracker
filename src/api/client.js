const API_BASE_URL = ('https://trackerbackend-o3r71w7rz-dawar-ali-bukharis-projects.vercel.app/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  console.log('[api] →', options.method || 'GET', url, options.body ? JSON.parse(options.body) : '')

  let response
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    })
  } catch (networkError) {
    console.error('[api] ✗ network error (fetch never completed) for', url, networkError)
    throw networkError
  }

  console.log('[api] ←', response.status, url)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`
    try {
      const body = await response.json()
      console.error('[api] error body', body)
      if (body?.error) message = body.error
    } catch {
      console.error('[api] error response was not JSON')
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  const data = await response.json()
  console.log('[api] data', data)
  return data
}

export function getShipment(trackingNumber) {
  return request(`/shipments/${encodeURIComponent(trackingNumber.trim().toUpperCase())}`)
}

export function listShipments() {
  return request('/shipments')
}

export function getShipmentSummary() {
  return request('/shipments/summary')
}

export function createShipment(payload) {
  return request('/shipments', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateShipment(trackingNumber, payload) {
  return request(`/shipments/${encodeURIComponent(trackingNumber)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
}

export function deleteShipment(trackingNumber) {
  return request(`/shipments/${encodeURIComponent(trackingNumber)}`, {
    method: 'DELETE'
  })
}

export function resetShipments() {
  return request('/shipments/reset', { method: 'POST' })
}

export function createInitialActivity(startDate, townCity) {
  return [{
    dayNumber: 1,
    status: 'Order placed',
    location: 'Austin, United States',
    flag: 'US',
    activityText: 'Order packed by supplier.',
    dateLabel: `${startDate} · 10:15`
  }, {
    dayNumber: 2,
    status: 'Departed origin',
    location: 'Austin, United States',
    flag: 'US',
    activityText: 'Shipment departed Austin distribution centre.',
    dateLabel: `${startDate} · 18:40`
  }, {
    dayNumber: 3,
    status: 'In transit',
    location: `${townCity}, South Africa`,
    flag: 'ZA',
    activityText: 'Shipment is moving through the international network.',
    dateLabel: `${startDate} · 22:15`
  }]
}