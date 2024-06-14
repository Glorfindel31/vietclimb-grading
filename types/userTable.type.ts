import type { Tables } from '~/types/supabase.type'

export type UserDataType = Tables<'users'>
export type RouteDataType = Tables<'routes'>
export type TopRecordsType = Tables<'top_records'>

export interface UserWithTopRecords extends UserDataType {
  top_records: TopRecordsType[]
}

export interface RouteWithTopRecords extends RouteDataType {
  top_records: TopRecordsType[]
}

export type RouteTabsDataType = Array<{
  zone:
    | 'Moon Korner'
    | 'Slabber'
    | 'High Tension'
    | 'Da Ruff'
    | 'Flat Door'
    | 'Titanic'
    | 'Hang Over Corner'
    | 'Bob Your Uncle'
    | 'Circle of Life'
  tabName: 'MK' | 'SL' | 'HT' | 'DR' | 'FD' | 'TI' | 'HOC' | 'BYU' | 'COL'
  cardDescription: string
  routes: RouteWithTopRecords[]
}>

export type UserWithTopRecordsAndRoutes = {
  id: number
  created_at: Date
  email: string
  displayed_name: string
  role: string
  UID: string
  show_rank: boolean
  show_height: boolean
  show_tops: boolean
  height: number
  arms: number
  birthdate: Date
  show_arms: boolean
  show_name: boolean
  show_birthdate: boolean
  top_records: TopRecord[]
}

export type TopRecord = {
  id: number
  TUID: string
  routes: Routes
  user_rate: number
  UID_linked: string
  created_at: Date
  user_grade: number
  URID_linked: string
}

export type Routes = {
  id: number
  RID: number
  URID: string
  zone_name: string
  route_date: Date
  route_link: null | string
  route_color: string
  route_grade: number
  route_setter: string
}
