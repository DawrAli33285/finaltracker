import React from 'react'
import { Clock3, Globe2, Package, ShieldCheck } from 'lucide-react'
import { routes } from '../../constants/routes'
import { CustomerPageHeader, InfoBlock } from '../../components/Shared'

export default function MoreInfo({ navigate }) {
  return (
    <section className="page-section">
      <CustomerPageHeader title="About Bulk Shipments" subtitle="Everything you need to know about grouped deliveries" navigate={navigate} />
      <div className="shell more-layout">
        <div className="more-intro"><div className="big-info-icon"><Package size={34} /></div><h2>Your order is shipped as part of a bulk shipment</h2><p>This helps us keep costs lower and ensures more reliable delivery. Individual tracking may not be available on the carrier's website until the shipment reaches the destination country.</p></div>
        <div className="more-grid">
          <InfoBlock icon={<Globe2 />} title="Why can't I track individually?" text="Individual tracking is not available on the carrier's website until the shipment reaches the destination country." />
          <InfoBlock icon={<Clock3 />} title="How it works" text="Your item is packed with other orders in a secure container and moves through international hubs." />
          <InfoBlock icon={<ShieldCheck />} title="Regular updates" text="We update your tracking every 1–3 days so you can follow the journey." />
          <InfoBlock icon={<ShieldCheck />} title="Safe & secure" text="All shipments are handled by trusted logistics partners and fully insured." />
        </div>
        <button className="primary-button more-close" onClick={() => navigate(routes.result)}>Close</button>
      </div>
    </section>
  )
}