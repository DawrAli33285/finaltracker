const API_BASE_URL = ('https://trackerbackend-puce.vercel.app/api').replace(/\/$/, '')

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
  return request(`/shipments/${encodeURIComponent(trackingNumber.trim().toUpperCase())}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
}

export function deleteShipment(trackingNumber) {
  return request(`/shipments/${encodeURIComponent(trackingNumber.trim().toUpperCase())}`, {
    method: 'DELETE'
  })
}

export function resetShipments() {
  return request('/shipments/reset', { method: 'POST' })
}

export function createInitialActivity(startDate, townCity) {
  return [{
    dayNumber: 1,
    status: 'Order picked up from supplier',
    location: 'Austin, United States',
    flag: 'US',
    activityText: 'Order picked up from supplier.',
    dateLabel: `${startDate} · 10:15`
  }, {
    dayNumber: 2,
    status: 'Departed from Austin, USA',
    location: 'Austin, United States',
    flag: 'US',
    activityText: 'Departed Austin distribution centre.',
    dateLabel: `${startDate} · 18:40`
  }, {
    dayNumber: 3,
    status: 'Arrived at Frankfurt hub',
    location: 'Frankfurt, Germany',
    flag: 'DE',
    activityText: 'Arrived at Frankfurt hub.',
    dateLabel: `${startDate} · 22:15`
  }, {
    dayNumber: 4,
    status: 'Departed Frankfurt hub',
    location: 'Frankfurt, Germany',
    flag: 'DE',
    activityText: 'Departed Frankfurt hub.',
    dateLabel: `${startDate} · 22:15`
  }, {
    dayNumber: 5,
    status: 'Arrived at Dubai hub',
    location: 'Dubai, United Arab Emirates',
    flag: 'AE',
    activityText: 'Arrived at Dubai hub.',
    dateLabel: `${startDate} · 22:15`
  }, {
    dayNumber: 6,
    status: 'Departed Dubai',
    location: 'Dubai, United Arab Emirates',
    flag: 'AE',
    activityText: 'Departed Dubai hub.',
    dateLabel: `${startDate} · 22:15`
  }, {
    dayNumber: 7,
    status: 'Arrived in South Africa',
    location: `${townCity}, South Africa`,
    flag: 'ZA',
    activityText: 'Arrived in South Africa.',
    dateLabel: `${startDate} · 22:15`
  }, {
    dayNumber: 8,
    status: 'Out for delivery',
    location: `${townCity}, South Africa`,
    flag: 'ZA',
    activityText: 'Shipment is out for delivery.',
    dateLabel: `${startDate} · 22:15`
  }, {
    dayNumber: 9,
    status: 'Delivered',
    location: `${townCity}, South Africa`,
    flag: 'ZA',
    activityText: 'Shipment delivered.',
    dateLabel: `${startDate} · 22:15`
  }]
}