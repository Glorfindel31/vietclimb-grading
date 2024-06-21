import type { Tables } from './supabase.type.js'

export type UserList = Tables<'users'>
export type TopRecords = Tables<'top_records'>
export type Routes = Tables<'routes'>

export interface TopRecordsRoutes extends TopRecords {
  routes: Routes
}
export interface UserListRecordsRoutes extends UserList {
  top_records: TopRecordsRoutes[]
}
