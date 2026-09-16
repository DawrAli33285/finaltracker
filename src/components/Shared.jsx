import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { routes } from '../constants/routes'

export function Feature({ icon, label }) {
  return <div className="feature-item"><span>{React.cloneElement(icon, { size: 20, strokeWidth: 1.7 })}</span><small>{label}</small></div>
}

export function CustomerPageHeader({ title, subtitle, navigate }) {
  return <div className="page-heading shell"><button className="back-link" onClick={() => navigate(routes.landing)}><ArrowLeft size={16} /> Back to tracking</button><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
}

export function Detail({ label, value }) {
  return <div className="detail-row"><small>{label}</small><span>{value}</span></div>
}

export function AdminPageTitle({ title, subtitle, action }) {
  return <div className="shell admin-page-title"><div><p className="admin-breadcrumb">Admin Portal</p><h1>{title}</h1>{subtitle && <p className="admin-subtitle">{subtitle}</p>}</div>{action && <button className="primary-button" onClick={action.onClick}>{action.icon}{action.label}</button>}</div>
}

export function StatCard({ icon, label, value }) {
  return <div className="stat-card"><span>{React.cloneElement(icon, { size: 21 })}</span><div><small>{label}</small><strong>{value}</strong></div></div>
}

export function Field({ label, value, icon, name, onChange }) {
  const inputProps = onChange ? { name, value, onChange } : { defaultValue: value }
  return <div className="form-section"><label>{label}</label><div className="field-input"><input {...inputProps} />{icon}</div></div>
}

export function InfoBlock({ icon, title, text }) {
  return <div className="info-block"><div className="info-block-icon">{React.cloneElement(icon, { size: 24, strokeWidth: 1.7 })}</div><div><h3>{title}</h3><p>{text}</p></div></div>
}

export function BackButton({ children, onClick }) {
  return <button className="admin-back" onClick={onClick}><ArrowLeft size={15} /> {children}</button>
}

export { ArrowRight }