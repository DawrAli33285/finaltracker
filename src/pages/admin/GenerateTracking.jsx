import React, { useState } from 'react'
import { ArrowRight, CalendarDays, ChevronDown, X } from 'lucide-react'
import { routes } from '../../constants/routes'
import { createInitialActivity, createShipment } from '../../api/client'
import Logo from '../../components/Logo'
import { AdminPageTitle, Field } from '../../components/Shared'

const initialForm = {
  carrierLabel: 'Maersk Air Cargo',
  recipientName: '',
  deliveryAddress: '',
  townCity: '',
  startDate: ''
}

function makeTrackingNumber() {
  return `IDT${Math.random().toString(36).slice(2, 11).toUpperCase()}`
}

export default function GenerateTracking({ navigate }) {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submit = async () => {
    setSaving(true)
    setError('')
    try {
      const trackingNumber = makeTrackingNumber()
      const shipment = await createShipment({
        trackingNumber,
        ...form,
        itemsOrdered: items,
        currentStatus: 'Pending',
        currentLocation: `${form.townCity}, South Africa`,
        currentFlag: 'ZA',
        demoDay: 1,
        activityLog: createInitialActivity(form.startDate, form.townCity)
      })
      navigate(`${routes.order}?tracking=${encodeURIComponent(shipment.trackingNumber)}`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="admin-page">
      <AdminPageTitle title="Generate Tracking Number" subtitle="Create a new shipment tracking page." />
      <div className="shell form-page-grid">
        <div className="admin-panel create-panel">
          <div className="form-section">
            <label>Select Carrier</label>
            <div className="select-wrap"><span className="carrier-mark blue-mark">✦</span><select name="carrierLabel" value={form.carrierLabel} onChange={update}><option>Maersk Air Cargo</option><option>Qatar Airways Cargo</option><option>Emirates SkyCargo</option><option>Turkish Cargo</option></select><ChevronDown size={16} /></div>
            <div className="carrier-options">
              <button type="button" className={form.carrierLabel === 'Maersk Air Cargo' ? 'selected' : ''} onClick={() => setForm({ ...form, carrierLabel: 'Maersk Air Cargo' })}><span className="carrier-mark blue-mark">✦</span> Maersk Air Cargo</button>
              <button type="button" className={form.carrierLabel === 'Qatar Airways Cargo' ? 'selected' : ''} onClick={() => setForm({ ...form, carrierLabel: 'Qatar Airways Cargo' })}><span className="carrier-mark yellow-mark">◆</span> Qatar Airways Cargo</button>
              <button type="button" className={form.carrierLabel === 'Emirates SkyCargo' ? 'selected' : ''} onClick={() => setForm({ ...form, carrierLabel: 'Emirates SkyCargo' })}><span className="carrier-mark red-mark">■</span> Emirates SkyCargo</button>
              <button type="button" className={form.carrierLabel === 'Turkish Cargo' ? 'selected' : ''} onClick={() => setForm({ ...form, carrierLabel: 'Turkish Cargo' })}><span className="carrier-mark red-mark">●</span> Turkish Cargo</button>
            </div>
          </div>
          <div className="two-col"><Field name="recipientName" label="Recipient Name" value={form.recipientName} onChange={update} /><Field name="deliveryAddress" label="Delivery Address" value={form.deliveryAddress} onChange={update} /></div>
          <div className="two-col"><Field name="townCity" label="Town / City" value={form.townCity} onChange={update} /><div className="form-section"><label>Items Ordered</label><div className="tag-input">{items.map((item) => <span key={item}>{item}<button type="button" onClick={() => setItems(items.filter((current) => current !== item))}><X size={12} /></button></span>)}</div></div></div>
          <div className="two-col"><Field name="startDate" label="Start Date" value={form.startDate} onChange={update} icon={<CalendarDays size={16} />} /><div /></div>
          {error && <div className="form-error api-form-error">{error}</div>}
          <button className="primary-button create-submit" onClick={submit} disabled={saving || items.length === 0}>{saving ? 'Saving shipment…' : 'Save & Generate Tracking Page'} {!saving && <ArrowRight size={16} />}</button>
        </div>
        <div className="admin-panel preview-panel"><div className="panel-head"><h2>Page preview</h2><span className="preview-live"><i /> Live preview</span></div><div className="preview-phone"><Logo navigate={navigate} /><div className="preview-status">Pending</div><h3>Track Your Order</h3><p>New tracking number</p><div className="preview-line" /><small>Your shipment details will appear here.</small></div></div>
      </div>
    </section>
  )
}