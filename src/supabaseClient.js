import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oyxejnfbtimwbicktjzk.supabase.co'
const supabaseAnonKey = 'sb_publishable_pPszK_tlHoc5BmqQMhiNUg_e21ffnuH'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
