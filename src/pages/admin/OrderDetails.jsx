import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check, Clipboard } from 'lucide-react'
import { routes } from '../../constants/routes'
import { getShipment } from '../../api/client'
import { BackButton, Detail } from '../../components/Shared'

export default function OrderDetails({ navigate }) {
  const trackingNumber = new URLSearchParams(window.location.search).get('tracking') || '773G63H12K53'
  const [shipment, setShipment] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getShipment(trackingNumber)
      .then(setShipment)
      .catch((requestError) => setError(requestError.message))
  }, [trackingNumber])

  const copyNumber = async () => {
    await navigator.clipboard?.writeText(shipment?.trackingNumber || trackingNumber)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section className="admin-page">
      <div className="shell order-detail-page">
        <BackButton onClick={() => navigate(routes.dashboard)}>Back to Dashboard</BackButton>
        <div className="order-title"><div><p className="admin-breadcrumb">Order management</p><h1>Order Details</h1></div><button className="outline-button" onClick={copyNumber}><Clipboard size={15} /> {copied ? 'Copied' : 'Copy tracking number'}</button></div>
        {error && <div className="admin-panel api-state"><strong>Unable to load order</strong><p>{error}</p></div>}
        {!error && !shipment && <div className="admin-panel api-state"><strong>Loading order…</strong><p>Connecting to the InternetDAT tracking service.</p></div>}
        {shipment && <div className="order-detail-grid">
          <div className="admin-panel order-info-panel"><h2>Shipment information</h2><div className="admin-details"><Detail label="Tracking Number" value={shipment.trackingNumber} /><Detail label="Recipient Name" value={shipment.recipientName} /><Detail label="Delivery Address" value={shipment.deliveryAddress} /><Detail label="Town / City" value={shipment.townCity} /><Detail label="Items Ordered" value={shipment.itemsOrdered.join(', ')} /><Detail label="Carrier" value={shipment.carrierLabel} /><Detail label="Start Date" value={shipment.startDate} /></div></div>
          <div className="admin-panel history-panel"><div className="panel-head"><h2>Tracking History</h2><span className="journey-status"><span /> {shipment.currentStatus}</span></div><div className="timeline compact">{shipment.activityLog.map((event) => { const state = event.dayNumber < shipment.demoDay ? 'done' : event.dayNumber === shipment.demoDay ? 'active' : 'upcoming'; return <div className={`timeline-row ${state}`} key={`${event.dayNumber}-${event.dateLabel}`}><span className="timeline-node">{state === 'done' && <Check size={11} />}</span><div><strong>{event.status}</strong><small>{event.dateLabel}</small></div></div> })}</div></div>
        </div>}
      </div>
    </section>
  )
}