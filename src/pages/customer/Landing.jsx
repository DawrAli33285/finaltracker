import React, { useState } from 'react'
import { Check, CircleHelp, Clock3, Globe2, Package, Plane, Search, ShieldCheck, ArrowRight } from 'lucide-react'
import { routes } from '../../constants/routes'
import { Feature } from '../../components/Shared'

export default function Landing({ navigate }) {
  const [number, setNumber] = useState('')
  const [error, setError] = useState(false)
  const submit = (event) => {
    event.preventDefault()
    const trackingNumber = number.trim().toUpperCase()
    if (trackingNumber.length !== 12) {
      setError(true)
      return
    }
    navigate(`${routes.result}?tracking=${encodeURIComponent(trackingNumber)}`)
  }

  return (
    <section className="hero-section">
      <div className="shell landing-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Global tracking, made simple</div>
          <h1>Track Your <span>Order</span></h1>
          <p className="hero-subtitle">Enter your 12-character tracking number<br className="mobile-only" /> to see the latest update on your shipment.</p>
          <form className="track-form" onSubmit={submit}>
            <label htmlFor="tracking-number" className="sr-only">Tracking number</label>
            <div className={`input-wrap ${error ? 'input-error' : ''}`}><Search size={18} /><input id="tracking-number" value={number} onChange={(event) => { setNumber(event.target.value); setError(false) }} placeholder="Enter your 12-character number" /><button type="button" className="paste-button" onClick={() => setNumber('773G63H12K53')}>Paste</button></div>
            {error && <span className="form-error">Please enter a valid tracking number.</span>}
            <button className="primary-button track-button" type="submit">Track shipment <ArrowRight size={17} /></button>
          </form>
          <div className="feature-row">
            <Feature icon={<Globe2 />} label="Global Shipping" />
            <Feature icon={<ShieldCheck />} label="Secure Handling" />
            <Feature icon={<Clock3 />} label="Regular Updates" />
            <Feature icon={<CircleHelp />} label="Customer Support" />
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-glow" />
          <div className="route-line route-one" /><div className="route-line route-two" />
          <div className="plane-illustration"><Plane size={136} strokeWidth={1.2} /></div>
          <div className="visual-caption"><span>Shop globally.</span> We handle the logistics.</div>
          <div className="floating-stat stat-top"><Package size={17} /><div><strong>247</strong><small>Active shipments</small></div></div>
          <div className="floating-stat stat-bottom"><Check size={16} /><div><strong>On the move</strong><small>Real-time updates</small></div></div>
        </div>
      </div>
    </section>
  )
}