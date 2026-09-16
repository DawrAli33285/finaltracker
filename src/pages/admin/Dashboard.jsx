import React, { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronRight, Package, Settings2, Truck, Zap } from 'lucide-react'
import { routes } from '../../constants/routes'
import { getShipmentSummary } from '../../api/client'
import { AdminPageTitle, StatCard } from '../../components/Shared'


import { useMemo } from 'react'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildWeekSeries(orders = []) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({ key: d.toDateString(), label: DAY_LABELS[d.getDay()], count: 0 })
  }

  const byDay = new Map(days.map((d) => [d.key, d]))

  orders.forEach((order) => {
    const raw = order.createdAt || order.date || order.updatedAt || order.lastUpdated
    if (!raw) return
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return
    d.setHours(0, 0, 0, 0)
    const bucket = byDay.get(d.toDateString())
    if (bucket) bucket.count += 1
  })

  const max = Math.max(...days.map((d) => d.count), 1)
  return days.map((d) => ({
    ...d,
    height: d.count === 0 ? 4 : Math.max(8, Math.round((d.count / max) * 100)),
  }))
}


export default function Dashboard({ navigate }) {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getShipmentSummary()
      .then(setSummary)
      .catch((requestError) => setError(requestError.message))
  }, [])

  const series = useMemo(() => buildWeekSeries(summary?.recent), [summary])

  return (
    <section className="admin-page">
      <AdminPageTitle title="Good morning, Admin" subtitle="Here's what's happening today." action={{ label: 'Generate Tracking Number', icon: <Zap size={16} />, onClick: () => navigate(routes.generate) }} />
      {error && <div className="shell api-state admin-api-state"><strong>Unable to load dashboard data</strong><p>{error}</p></div>}
      <div className="shell stats-grid">
        <StatCard icon={<CalendarDays />} label="Orders Delivered Today" value={summary?.delivered ?? '—'} />
        <StatCard icon={<Package />} label="Total Orders" value={summary?.total ?? '—'} />
        <StatCard icon={<Truck />} label="Active Shipments" value={summary ? summary.inTransit + summary.pending : '—'} />
      </div>
      <div className="shell admin-content-grid">
        <div className="admin-panel orders-panel">
          <div className="panel-head"><h2>Recent Orders</h2><button className="text-button">View All <ArrowRight size={14} /></button></div>
          <div className="orders-list">
            {(summary?.recent || []).map((order) => {
              const status = order.currentStatus || 'Pending'
              const color = status.toLowerCase().includes('deliver') ? 'gray' : status.toLowerCase().includes('transit') ? 'blue' : status.toLowerCase().includes('hub') ? 'amber' : 'green'
              return <button className="order-row" key={order.trackingNumber} onClick={() => navigate(`${routes.order}?tracking=${encodeURIComponent(order.trackingNumber)}`)}><span className="order-box"><Package size={14} /></span><strong>{order.trackingNumber}</strong><span className={`order-status ${color}`}><i />{status}</span><ChevronRight size={15} /></button>
            })}
            {!summary && !error && <div className="api-list-loading">Loading recent orders…</div>}
            {summary?.recent?.length === 0 && <div className="api-list-loading">No shipments found.</div>}
          </div>
        </div>
        <div className="admin-panel chart-panel">
          <div className="panel-head"><h2>Shipment overview</h2><button className="icon-button"><Settings2 size={16} /></button></div>
          <div className="fake-chart">
  <div className="chart-bars">
    {series.map((d) => (
      <i key={d.key} style={{ height: `${d.height}%` }} title={`${d.label}: ${d.count} shipment(s)`} />
    ))}
  </div>
  <div className="chart-labels">
    {series.map((d) => <span key={d.key}>{d.label}</span>)}
  </div>
</div>
        </div>
      </div>
    </section>
  )
}