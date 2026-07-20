import { createClient } from '@supabase/supabase-js'

// .envファイルからSupabaseの接続情報を取得する
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// アプリ全体で共有するSupabaseクライアント
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
