import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PropertyList from './pages/PropertyList'

// アプリ全体のルーティング定義
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/properties" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <PropertyList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
