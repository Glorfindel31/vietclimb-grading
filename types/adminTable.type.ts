import type { Tables, TablesInsert } from '~/types/supabase.type'

export interface RowsAdditional {
  identical?: boolean
}
export interface NewGoogleRows {
  id: number
  RID: string
  URID: string
  zone_name: string
  route_color: string | null
  route_grade: string | null
  route_setter: string | null
  route_date: string | null
  route_link: string | null
}

export type mutatedData = {
  name: string
  id: string
  color: string
  grade: string
  setter: string
  comment: string
  date: string
  link: string
}

export type dataMutationResult = {
  transformedValues: mutatedData[]
  routeNum: number
}

export type RowData = [
  name: string,
  id: string,
  colorCode: string,
  grade: string,
  setter: string,
  comment: string,
  date: string,
  link?: string,
]

export type dataMutationResultExtended = dataMutationResult & RowsAdditional
export type DataBaseInsert = TablesInsert<'routes'>
export type DataBaseExtended = Tables<'routes'> & RowsAdditional

export type Data = RowData[]
export type ColorCodes = 'R' | 'G' | 'BL' | 'Y' | 'PI' | 'PR' | 'BK' | 'O' | 'W'
export type ColorReplacements = Record<ColorCodes, string>
