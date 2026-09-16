import React, { useState } from 'react'
import { ArrowRight, CalendarDays, ChevronDown, Plus, X } from 'lucide-react'
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
  const [itemDraft, setItemDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const addItem = () => {
    const value = itemDraft.trim()
    if (!value) return
    if (items.includes(value)) {
      setItemDraft('')
      return
    }
    setItems((current) => [...current, value])
    setItemDraft('')
  }

  const removeItem = (item) => {
    setItems((current) => current.filter((existing) => existing !== item))
  }

  const handleItemKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addItem()
    } else if (event.key === 'Backspace' && !itemDraft && items.length > 0) {
      // quick-remove the last tag when backspacing on an empty input
      setItems((current) => current.slice(0, -1))
    }
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
            <div className="carrier-options">
              <button type="button" className={form.carrierLabel === 'Maersk Air Cargo' ? 'selected' : ''} onClick={() => setForm({ ...form, carrierLabel: 'Maersk Air Cargo' })}><span className="carrier-mark blue-mark">✦</span> Maersk Air Cargo</button>
              <button type="button" className={form.carrierLabel === 'Qatar Airways Cargo' ? 'selected' : ''} onClick={() => setForm({ ...form, carrierLabel: 'Qatar Airways Cargo' })}><span className="carrier-mark yellow-mark">◆</span> Qatar Airways Cargo</button>
              <button type="button" className={form.carrierLabel === 'Emirates SkyCargo' ? 'selected' : ''} onClick={() => setForm({ ...form, carrierLabel: 'Emirates SkyCargo' })}><span className="carrier-mark red-mark">■</span> Emirates SkyCargo</button>
              <button type="button" className={form.carrierLabel === 'Turkish Cargo' ? 'selected' : ''} onClick={() => setForm({ ...form, carrierLabel: 'Turkish Cargo' })}><span className="carrier-mark red-mark">●</span> Turkish Cargo</button>
            </div>
          </div>

          <div className="two-col">
            <Field name="recipientName" label="Recipient Name" value={form.recipientName} onChange={update} />
            <Field name="deliveryAddress" label="Delivery Address" value={form.deliveryAddress} onChange={update} />
          </div>

          <div className="two-col">
            <Field name="townCity" label="Town / City" value={form.townCity} onChange={update} />

            <div className="form-section">
              <label>Items Ordered</label>
              <div className="tag-input tag-input-interactive">
                {items.map((item) => (
                  <span key={item} className="tag-chip">
                    {item}
                    <button type="button" onClick={() => removeItem(item)} aria-label={`Remove ${item}`}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="tag-input-field"
                  placeholder={items.length === 0 ? 'Type an item and press Enter' : 'Add another…'}
                  value={itemDraft}
                  onChange={(event) => setItemDraft(event.target.value)}
                  onKeyDown={handleItemKeyDown}
                />
                <button
                  type="button"
                  className="tag-add-button"
                  onClick={addItem}
                  disabled={!itemDraft.trim()}
                  aria-label="Add item"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="two-col">
            <div className="form-section">
              <label htmlFor="startDate">Start Date</label>
              <div className="date-input-wrap">
                <CalendarDays size={16} className="date-input-icon" />
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  className="date-input-field"
                  value={form.startDate}
                  onChange={update}
                />
              </div>
            </div>
            <div />
          </div>

          {error && <div className="form-error api-form-error">{error}</div>}
          <button className="primary-button create-submit" onClick={submit} disabled={saving || items.length === 0}>{saving ? 'Saving shipment…' : 'Save & Generate Tracking Page'} {!saving && <ArrowRight size={16} />}</button>
        </div>
        <div className="admin-panel preview-panel"><div className="panel-head"><h2>Page preview</h2><span className="preview-live"><i /> Live preview</span></div><div className="preview-phone"><Logo navigate={navigate} /><div className="preview-status">Pending</div><h3>Track Your Order</h3><p>New tracking number</p><div className="preview-line" /><small>Your shipment details will appear here.</small></div></div>
      </div>

      <style>{`
        .tag-input-interactive {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          padding: 8px;
          border: 1px solid var(--border-color, #e2e2e2);
          border-radius: 10px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          min-height: 44px;
        }
        .tag-input-interactive:focus-within {
          border-color: #4f7cff;
          box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.15);
        }
        .tag-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eef2ff;
          color: #3547a8;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          animation: chip-in 0.12s ease-out;
        }
        .tag-chip button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #3547a8;
          cursor: pointer;
          border-radius: 50%;
          padding: 2px;
          transition: background 0.12s ease;
        }
        .tag-chip button:hover {
          background: rgba(53, 71, 168, 0.15);
        }
        .tag-input-field {
          flex: 1;
          min-width: 120px;
          border: none;
          outline: none;
          font-size: 14px;
          padding: 4px;
          background: transparent;
        }
        .tag-add-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: none;
          background: #4f7cff;
          color: white;
          cursor: pointer;
          transition: transform 0.12s ease, background 0.12s ease, opacity 0.12s ease;
        }
        .tag-add-button:hover:not(:disabled) {
          transform: scale(1.08);
          background: #3f68e0;
        }
        .tag-add-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        @keyframes chip-in {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }

        .date-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color, #e2e2e2);
          border-radius: 10px;
          padding: 0 10px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .date-input-wrap:focus-within {
          border-color: #4f7cff;
          box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.15);
        }
        .date-input-icon {
          color: #8a8fa3;
          flex-shrink: 0;
        }
        .date-input-field {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 10px 8px;
          font-size: 14px;
          font-family: inherit;
          color: inherit;
        }
        .date-input-field::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.12s ease;
        }
        .date-input-field::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }

        .carrier-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .carrier-options button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1.5px solid var(--border-color, #e2e2e2);
          background: white;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
        }
        .carrier-options button:hover {
          border-color: #b9c4ff;
        }
        .carrier-options button.selected {
          border-color: #4f7cff;
          background: #eef2ff;
          box-shadow: 0 0 0 2px rgba(79, 124, 255, 0.15);
          font-weight: 600;
        }
      `}</style>
    </section>
  )
}