import React, { useEffect, useState } from 'react'
import { ArrowRight, Clipboard, Info, Plane, ShieldCheck } from 'lucide-react'
import { routes } from '../../constants/routes'
import { CustomerPageHeader, Detail } from '../../components/Shared'
import { RouteCard, ShipmentDetails } from '../../components/ShipmentDetails'
import { getShipment } from '../../api/client'

export default function TrackingResult({ navigate }) {
  const trackingNumber = new URLSearchParams(window.location.search).get('tracking') || '773G63H12K53'
  const [shipment, setShipment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setShipment(null)
    setError('')
    getShipment(trackingNumber)
      .then((data) => active && setShipment(data))
      .catch((requestError) => active && setError(requestError.message))
    return () => { active = false }
  }, [trackingNumber])

  const copyTrackingNumber = () => {
    navigator.clipboard?.writeText(shipment?.trackingNumber || trackingNumber)
  }

  const latestEvent = shipment?.activityLog?.find((event) => event.dayNumber === shipment.demoDay) || shipment?.activityLog?.[shipment.activityLog.length - 1]

  return (
    <section className="page-section">
      <CustomerPageHeader title="Tracking Result" subtitle="Shipment details and latest location" navigate={navigate} />
      <div className="shell result-layout">
        {error && <div className="result-main api-state"><strong>Unable to load shipment</strong><p>{error}</p><button className="outline-button" onClick={() => navigate(routes.landing)}>Back to tracking</button></div>}
        {!error && !shipment && <div className="result-main api-state"><strong>Loading shipment…</strong><p>Connecting to the InternetDAT tracking service.</p></div>}
        {shipment && <div className="result-main">
          <div className="status-banner"><span className="status-icon"><Plane size={23} /></span><div><strong>{shipment.currentStatus}</strong><p>{latestEvent?.activityText || 'Latest shipment update received.'}</p></div><div className="status-date"><strong>{latestEvent?.dateLabel || shipment.startDate}</strong><small>Latest update</small></div></div>
          <div className="tracking-id-row"><div><small>Tracking Number</small><strong>{shipment.trackingNumber}</strong></div><button className="copy-btn" aria-label="Copy tracking number" onClick={copyTrackingNumber}><Clipboard size={17} /></button></div>
          <RouteCard shipment={shipment} />
          <ShipmentDetails shipment={shipment} />
          <div className="info-strip"><Info size={17} /><span>This shipment is part of a bulk shipment. <button onClick={() => navigate(routes.more)}>Learn more <ArrowRight size={13} /></button></span></div>
          <div className="location-card"><div className="location-heading"><span className="country-dot germany" /><div><small>Current Location</small><strong>{shipment.currentLocation}</strong></div></div><span className="location-updated">Updated {latestEvent?.dateLabel || shipment.startDate}</span></div>
          <button className="outline-button full-button" onClick={() => navigate(`${routes.journey}?tracking=${encodeURIComponent(shipment.trackingNumber)}`)}>View full tracking journey <ArrowRight size={16} /></button>
        </div>}
        <aside className="result-aside"><div className="aside-card"><div className="aside-icon"><ShieldCheck /></div><h3>We handle the journey</h3><p>Stay updated from pickup to delivery with reliable, secure tracking.</p><button className="text-button" onClick={() => navigate(routes.more)}>How it works <ArrowRight size={14} /></button></div></aside>
      </div>
    </section>
  )
}