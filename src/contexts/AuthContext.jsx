import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// 認証状態(ログイン中のユーザー情報)をアプリ全体で共有するためのContext
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // 初回のセッション確認が終わるまでのローディング状態
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 起動時に現在のセッションを取得し、ログイン状態を復元する
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // ログイン・ログアウトなど認証状態の変化を監視する
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // メールアドレス・パスワードでの会員登録
  const signUp = (email, password) => {
    return supabase.auth.signUp({ email, password })
  }

  // メールアドレス・パスワードでのログイン
  const signIn = (email, password) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  // ログアウト
  const signOut = () => {
    return supabase.auth.signOut()
  }

  const value = { user, loading, signUp, signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 認証情報を利用するためのカスタムフック
export function useAuth() {
  return useContext(AuthContext)
}
