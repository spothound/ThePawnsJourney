import type { Color } from 'chessground/types'
import type { User } from '@/types'

// It converts the color from char to string
export function shortToLongColor(color: 'w' | 'b'): Color {
  return color === 'w' ? 'white' : 'black'
}
// It validates the user id in the local storage
export const checkIdOnLocalStorage = (id: string): boolean => {
  return localStorage.getItem(id) !== null
}

// It saves the user data to the local storage
export const loginDataToLocalstorage = (data: User) => {
  localStorage.setItem(data.id, JSON.stringify(data))
}

// It erases the cookies
export const eraseCookies = () => {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

// It shuffles the array (Fisher-Yates algorithm)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array]
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }
  return shuffledArray
}
