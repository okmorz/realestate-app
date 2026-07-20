import { useState } from 'react'

// 空の初期値(新規登録時に使用)
const emptyValues = { name: '', rent: '', area: '', layout: '' }

// 物件の新規登録・編集で共用するフォーム
// initialProperty が渡された場合は編集モードとして扱う
export default function PropertyForm({ initialProperty, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(
    initialProperty
      ? {
          name: initialProperty.name,
          rent: String(initialProperty.rent),
          area: initialProperty.area,
          layout: initialProperty.layout,
        }
      : emptyValues,
  )
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const rentNumber = Number(values.rent)
    if (!Number.isInteger(rentNumber) || rentNumber < 0) {
      setError('家賃は0以上の整数で入力してください。')
      return
    }

    try {
      await onSubmit({
        name: values.name.trim(),
        rent: rentNumber,
        area: values.area.trim(),
        layout: values.layout.trim(),
      })
    } catch {
      setError('保存に失敗しました。時間をおいて再度お試しください。')
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{initialProperty ? '物件を編集' : '物件を新規登録'}</h2>

      {error && <p className="form-error">{error}</p>}

      <label className="form-field">
        <span>物件名</span>
        <input type="text" value={values.name} onChange={handleChange('name')} required />
      </label>

      <label className="form-field">
        <span>家賃(円)</span>
        <input
          type="number"
          min="0"
          step="1"
          value={values.rent}
          onChange={handleChange('rent')}
          required
        />
      </label>

      <label className="form-field">
        <span>エリア名</span>
        <input type="text" value={values.area} onChange={handleChange('area')} required />
      </label>

      <label className="form-field">
        <span>間取り</span>
        <input
          type="text"
          value={values.layout}
          onChange={handleChange('layout')}
          placeholder="例: 1LDK"
          required
        />
      </label>

      <div className="property-form-actions">
        <button type="button" className="button-secondary" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : '保存する'}
        </button>
      </div>
    </form>
  )
}
