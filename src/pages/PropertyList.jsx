import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { dummyProperties } from '../data/dummyProperties'

// 家賃を「¥123,000」のような表示形式に整形する
const formatRent = (rent) => `¥${rent.toLocaleString()}`

// 物件一覧画面
export default function PropertyList() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="property-page">
      <header className="property-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-as">{user?.email} でログイン中</p>
        </div>
        <button type="button" onClick={handleLogout}>
          ログアウト
        </button>
      </header>

      <div className="property-grid">
        {dummyProperties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2>{property.name}</h2>
            <p className="property-rent">{formatRent(property.rent)} / 月</p>
            <p className="property-area">{property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
