import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Detail } from './Shared'

export function RouteCard({ shipment }) {
  const finalLocation = shipment?.activityLog?.[shipment.activityLog.length - 1]?.location || `${shipment?.townCity || 'Bloemfontein'}, South Africa`
  const [destination, country = 'South Africa'] = finalLocation.split(',').map((part) => part.trim())
 const destinationClass = 'za'

  return <div className="route-card"><div className="route-point"><span className="flag us" /><small>From</small><strong>Austin</strong><span>United States</span></div><div className="route-connector"><ArrowRight size={18} /><span>to</span></div><div className="route-point"><span className={`flag ${destinationClass}`} /><small>To</small><strong>{shipment?.townCity || destination}</strong><span>{country}</span></div></div>
}

export function ShipmentDetails({ shipment }) {
  return <div className="details-card"><Detail label="Recipient" value={shipment?.recipientName} /><Detail label="Delivery Address" value={shipment?.deliveryAddress} /><Detail label="Items Ordered" value={shipment?.itemsOrdered?.join(', ')} /><Detail label="Handled By" value={shipment?.carrierLabel} /></div>
}

export function Timeline({ entries }) {
  return <div className="timeline">{entries.map(([name, date, state]) => <div className={`timeline-row ${state}`} key={name}><span className="timeline-node">{state === 'done' && <span className="timeline-check">✓</span>}</span><div><strong>{name}</strong><small>{date}</small></div></div>)}</div>
}