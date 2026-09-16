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

  const timeline = shipment?.activityLog?.map((event) => [
    event.status,
    event.dateLabel,
    event.dayNumber < shipment.demoDay ? 'done' : event.dayNumber === shipment.demoDay ? 'active' : 'upcoming'
  ]) || []

  const updates = [...(shipment?.activityLog || [])].reverse()

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
        <div className="updates-card">
          <h2>Latest Updates</h2>
          <div className="updates-list">{updates.map((event) => <div className="update-row" key={`${event.dayNumber}-${event.dateLabel}`}><span className="update-dot" /><div><small>{event.dateLabel}</small><p>{event.activityText}</p></div></div>)}</div>
          <button className="outline-button full-button" onClick={() => navigate(`${routes.result}?tracking=${encodeURIComponent(shipment.trackingNumber)}`)}>Back to shipment details <ArrowRight size={16} /></button>
        </div>
      </div>}
    </section>
  )
}