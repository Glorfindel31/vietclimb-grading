import { google } from 'googleapis'

//type definitions
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

type Data = RowData[]

type ColorCodes = 'R' | 'G' | 'BL' | 'Y' | 'PI' | 'PR' | 'BK' | 'O' | 'W'
type ColorReplacements = Record<ColorCodes, string>

const colorReplacements: ColorReplacements = {
  R: 'red',
  G: 'green',
  BL: 'blue',
  Y: 'yellow',
  PI: 'pink',
  PR: 'purple',
  BK: 'black',
  O: 'orange',
  W: 'white',
}

//env variables
const spreadSheetId = process.env.SHEET_ID

const keys = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
  client_x509_cert_url: process.env.CLIENT,
  universe_domain: process.env.UNIVERSE_DOMAIN,
}

function convertToISODate(dateString: string): string {
  const [day, month, year] = dateString.split('/')

  let adjustedYear = parseInt(year, 10)
  if (adjustedYear < 100) {
    adjustedYear += 2000
  }

  const date = new Date(adjustedYear, parseInt(month) - 1, parseInt(day))

  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000
  const adjustedDate = new Date(date.getTime() - timezoneOffset)

  const isoDate = adjustedDate.toISOString()
  return isoDate
}

function dataMutation(data: Data): dataMutationResult {
  let name: string = ''
  const transformedValues: mutatedData[] = (data as RowData[]).map(
    (row: RowData, _index: number): mutatedData => {
      row[1] === '1' ? (name = row[0]) : (name = name as string)
      const link = row[7] || ''
      const color = colorReplacements[row[2] as ColorCodes] || row[2] || ''
      return {
        name: name,
        id: row[1] || '',
        color: color,
        grade: row[3] || '',
        setter: (row[4] || '').toLowerCase(),
        comment: row[5] || '',
        date: row[6] ? convertToISODate(row[6]) : '',
        link: link,
      }
    },
  )
  return {
    transformedValues,
    routeNum: transformedValues.length,
  }
}

const client = new google.auth.JWT(
  keys.client_email,
  undefined,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets'],
)
client.authorize(function (err, _tokens) {
  if (err) {
    console.log(err)
    return
  } else {
    console.log('Authorized successfully')
  }
})

export default defineEventHandler(async _event => {
  try {
    const gsapi = google.sheets({ version: 'v4', auth: client })

    const opt = {
      spreadsheetId: spreadSheetId,
      range: 'Sheet1!B3:I137',
    }

    const data = await gsapi.spreadsheets.values.get(opt)
    if (!data || !data.data || !data.data.values) {
      throw new Error('Failed to fetch data from Google Sheets')
    }

    const { transformedValues, routeNum } = dataMutation(
      data.data.values as Data,
    )

    return { transformedValues, routeNum }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
})
