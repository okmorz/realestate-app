import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 会員登録画面
export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    const { data, error: signUpError } = await signUp(email, password)

    setSubmitting(false)

    if (signUpError) {
      setError('会員登録に失敗しました。入力内容をご確認ください。')
      return
    }

    // Supabaseの設定でメール確認が必須の場合はセッションが発行されないため、
    // その場合はログイン画面へ案内する
    if (!data.session) {
      setMessage('確認メールを送信しました。メール内のリンクから認証を完了してください。')
      return
    }

    navigate('/properties')
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-message">{message}</p>}

        <label className="form-field">
          <span>メールアドレス</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="form-field">
          <span>パスワード</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '会員登録'}
        </button>

        <p className="auth-switch">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </form>
    </div>
  )
}
