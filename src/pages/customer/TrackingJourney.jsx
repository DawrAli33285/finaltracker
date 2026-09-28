import React, { useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { routes } from '../../constants/routes'
import { CustomerPageHeader } from '../../components/Shared'
import { getShipment } from '../../api/client'

export default function TrackingJourney({ navigate }) {
  const trackingNumber = new URLSearchParams(window.location.search).get('tracking') || '773G63H12K53'
  const [shipment, setShipment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getShipment(trackingNumber)
      .then((data) => active && setShipment(data))
      .catch((requestError) => active && setError(requestError.message))
    return () => { active = false }
  }, [trackingNumber])

  
  const log = shipment?.activityLog || []

  // Index of the current step: matches status + location, falls back to status only
  let currentIndex = log.findIndex(
    (event) =>
      event.dayNumber === shipment?.demoDay &&
      event.status === shipment?.currentStatus &&
      event.location === shipment?.currentLocation
  )
  if (currentIndex === -1) {
    currentIndex = log.findIndex(
      (event) =>
        event.dayNumber === shipment?.demoDay &&
        event.status === shipment?.currentStatus
    )
  }
  if (currentIndex === -1) currentIndex = log.length - 1

  const visibleEvents = shipment ? log.slice(0, currentIndex + 1) : []

  const timeline = visibleEvents.map((event, index) => [
    event.status,
    event.dateLabel,
    index < currentIndex ? 'done' : 'active'
  ])

  const updates = [...visibleEvents].reverse()
  return (
    <section className="page-section">
      <CustomerPageHeader title="Tracking Journey" subtitle="A complete view of your shipment's progress" navigate={navigate} />
      {error && <div className="shell result-main api-state"><strong>Unable to load journey</strong><p>{error}</p></div>}
      {!error && !shipment && <div className="shell result-main api-state"><strong>Loading journey…</strong><p>Connecting to the InternetDAT tracking service.</p></div>}
      {shipment && <div className="shell journey-layout">
        <div className="journey-card">
          <div className="journey-head"><div><small>Tracking Number</small><strong>{shipment.trackingNumber}</strong></div><span className="journey-status"><span /> {shipment.currentStatus}</span></div>
          <div className="timeline">{timeline.map(([name, date, state]) => <div className={`timeline-row ${state}`} key={`${name}-${date}`}><span className="timeline-node">{state === 'done' && <Check size={11} />}</span><div><strong>{name}</strong><small>{date}</small></div></div>)}</div>
        </div>
     
      </div>}
    </section>
  )
}