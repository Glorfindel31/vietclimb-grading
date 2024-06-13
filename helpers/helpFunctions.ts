import type { Updater } from '@tanstack/vue-table'
import { type Ref } from 'vue'
import type {
  RouteCount,
  RouteCountSetter,
  Route,
} from '~/types/dataTable.type'

export const transformData = (incomingData: Route[]): RouteCount[] => {
  const data: RouteCount[] = []

  incomingData.reduce((gradeCounts, route) => {
    const existing = gradeCounts.find(d => d.level === route.grade)
    if (existing) {
      existing.amount++
    }
    else {
      gradeCounts.push({
        level: route.grade,
        amount: 1,
      })
    }
    return gradeCounts
  }, data)
  data.sort((a, b) => {
    return Number(a.level) - Number(b.level)
  })
  return data
}
export const transformDataSetter = (
  incomingData: Route[],
): RouteCountSetter[] => {
  const data: RouteCountSetter[] = []
  incomingData.reduce((nameCount, route) => {
    const existing = nameCount.find(d => d.name === route.setter)
    if (existing) {
      existing.amount++
    }
    else {
      nameCount.push({
        name: route.setter,
        amount: 1,
      })
    }
    return nameCount
  }, data)
  data.sort((a, b) => b.amount - a.amount)
  return data
}
export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date as Date)

export const easyRouteCounter = (data: RouteCount[]): number => {
  return data.reduce((count, route) => {
    if (route.level === '1') {
      return route.amount
    }
    if (route.level === '2' || route.level === '3') {
      return count + route.amount
    }
    return count
  }, 0)
}
export const normalRouteCounter = (data: RouteCount[]): number => {
  return data.reduce((count, route) => {
    if (route.level === '4') {
      return route.amount
    }
    if (route.level === '5') {
      return count + route.amount
    }
    return count
  }, 0)
}
export const formatDateString = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-based
  const year = date.getFullYear().toString().slice(2)
  return `${day}/${month}/${year}`
}
export function valueUpdater<T, U extends Updater<T>>(
  updaterOrValue: U,
  ref: Ref<T>,
) {
  ref.value
		= typeof updaterOrValue === 'function'
		  ? updaterOrValue(ref.value)
		  : updaterOrValue
}

export function stringCompressor(input: string) {
  function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }

  function shuffle(array: Array<string>, seed: number) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex

    while (0 !== currentIndex) {
      randomIndex = Math.floor(seededRandom(seed) * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }
  const inputString = input.toString()
  const array = inputString
    .toLowerCase()
    .split('')
    .filter(char => /[a-z1-9]/.test(char))
  const seed = inputString
    .split('')
    .filter(char => /[0-9]/.test(char))
    .reduce((acc, curr) => acc + parseInt(curr), 0)

  return shuffle(array, seed).slice(0, 30).join('') as string
}
