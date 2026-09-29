import React, { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import { routes } from '../../constants/routes'
import { listShipments } from '../../api/client'
import { AdminPageTitle, BackButton } from '../../components/Shared'

function statusColor(status = '') {
  const s = status.toLowerCase()
  if (s.includes('deliver')) return 'gray'
  if (s.includes('transit')) return 'blue'
  if (s.includes('hub')) return 'amber'
  return 'green'
}

export default function AllOrders({ navigate }) {
  const [shipments, setShipments] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    listShipments()
      .then((data) => setShipments(Array.isArray(data) ? data : data?.shipments || []))
      .catch((requestError) => setError(requestError.message))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...(shipments || [])].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    if (!q) return sorted
    return sorted.filter((s) =>
      [s.trackingNumber, s.recipientName, s.townCity, s.carrierLabel, s.currentStatus]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q))
    )
  }, [shipments, query])

  return (
    <section className="admin-page">
      <AdminPageTitle title="All Orders" subtitle="Every shipment in the system." />
      <div className="shell">
        <BackButton onClick={() => navigate(routes.dashboard)}>Back to Dashboard</BackButton>
        <div className="admin-panel all-orders-panel">
          <div className="all-orders-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search tracking number, recipient, city, status…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {error && <div className="api-state"><strong>Unable to load orders</strong><p>{error}</p></div>}
          {!error && !shipments && <div className="api-list-loading">Loading orders…</div>}
          {shipments && filtered.length === 0 && <div className="api-list-loading">No shipments found.</div>}

          {filtered.length > 0 && (
            <div className="all-orders-scroll">
              <table className="all-orders-table">
                <thead>
                  <tr>
                    <th>Tracking Number</th>
                    <th>Recipient</th>
                    <th>Town / City</th>
                    <th>Items</th>
                    <th>Carrier</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr
                      key={s.trackingNumber}
                      onClick={() => navigate(`${routes.order}?tracking=${encodeURIComponent(s.trackingNumber)}`)}
                    >
                      <td><strong>{s.trackingNumber}</strong></td>
                      <td>{s.recipientName}</td>
                      <td>{s.townCity}</td>
                      <td>{(s.itemsOrdered || []).join(', ')}</td>
                      <td>{s.carrierLabel}</td>
                      <td>{s.startDate}</td>
                      <td><span className={`order-status ${statusColor(s.currentStatus)}`}><i />{s.currentStatus}</span></td>
                      <td><ChevronRight size={15} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .all-orders-panel { margin-top: 14px; }
        .all-orders-search {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border-color, #e2e2e2);
          border-radius: 10px;
          padding: 0 12px;
          margin-bottom: 14px;
        }
        .all-orders-search input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 10px 0;
          font-size: 14px;
          font-family: inherit;
        }
        .all-orders-scroll { overflow-x: auto; }
        .all-orders-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .all-orders-table th {
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #8a8fa3;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-color, #e2e2e2);
          white-space: nowrap;
        }
        .all-orders-table td {
          padding: 12px;
          border-bottom: 1px solid var(--border-color, #f0f0f0);
          white-space: nowrap;
        }
        .all-orders-table tbody tr { cursor: pointer; }
        .all-orders-table tbody tr:hover { background: #f6f8ff; }
      `}</style>
    </section>
  )
}