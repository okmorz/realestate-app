import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'
import { createProperty, deleteProperty, fetchProperties, updateProperty } from '../api/properties'

// 家賃を「¥123,000」のような表示形式に整形する
const formatRent = (rent) => `¥${rent.toLocaleString()}`

// 物件一覧画面(Supabaseのpropertiesテーブルに対するCRUD操作)
export default function PropertyList() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // フォームの表示状態: null(非表示) / 'create'(新規登録) / 編集対象の物件オブジェクト
  const [formTarget, setFormTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadProperties = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch {
      setLoadError('物件一覧の取得に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  // 新規登録フォームの送信
  const handleCreate = async (values) => {
    setSubmitting(true)
    try {
      const created = await createProperty({ ...values, userId: user.id })
      setProperties((prev) => [created, ...prev])
      setFormTarget(null)
    } finally {
      setSubmitting(false)
    }
  }

  // 編集フォームの送信
  const handleUpdate = async (values) => {
    setSubmitting(true)
    try {
      const updated = await updateProperty(formTarget.id, values)
      setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setFormTarget(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (property) => {
    const confirmed = window.confirm(`「${property.name}」を削除します。よろしいですか?`)
    if (!confirmed) return

    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    } catch {
      window.alert('削除に失敗しました。時間をおいて再度お試しください。')
    }
  }

  const isFormOpen = formTarget !== null

  return (
    <div className="property-page">
      <header className="property-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-as">{user?.email} でログイン中</p>
        </div>
        <div className="property-header-actions">
          <button type="button" onClick={() => setFormTarget('create')} disabled={isFormOpen}>
            + 新規物件を登録
          </button>
          <button type="button" className="button-secondary" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      {isFormOpen && (
        <PropertyForm
          initialProperty={formTarget === 'create' ? null : formTarget}
          onSubmit={formTarget === 'create' ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          submitting={submitting}
        />
      )}

      {loading && <p>読み込み中...</p>}
      {loadError && <p className="form-error">{loadError}</p>}

      {!loading && !loadError && properties.length === 0 && (
        <p>登録されている物件はまだありません。「+ 新規物件を登録」から追加してください。</p>
      )}

      <div className="property-grid">
        {properties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2>{property.name}</h2>
            <p className="property-rent">{formatRent(property.rent)} / 月</p>
            <p className="property-area">
              {property.area} ・ {property.layout}
            </p>
            <div className="property-card-actions">
              <button type="button" className="button-secondary" onClick={() => setFormTarget(property)}>
                編集
              </button>
              <button type="button" className="button-danger" onClick={() => handleDelete(property)}>
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
