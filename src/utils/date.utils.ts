function isInvalidDate(date: Date) {
  return Number.isNaN(date.getTime())
}


export function formatDateAsFullTimePlusFullDate(date: Date | string | undefined | null) {
  if (date == null) {
    return null
  }

  const dateResolved = typeof date === 'string' ? new Date(date) : date

  if (isInvalidDate(dateResolved)) {
    return null
  }

  const year = String(dateResolved.getFullYear()).padStart(4, '0')
  const month = String(dateResolved.getMonth() + 1).padStart(2, '0')
  const day = String(dateResolved.getDate()).padStart(2, '0')

  const hours = String(dateResolved.getHours()).padStart(2, '0')
  const minutes = String(dateResolved.getMinutes()).padStart(2, '0')
  const seconds = String(dateResolved.getSeconds()).padStart(2, '0')

  const result = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`

  return result
}

export function formatDateAsFullDatePlusFullTime(date: Date | number | string | undefined | null) {
  if (date == null) {
    return null
  }

  const dateResolved = (typeof date === 'string' || typeof date === 'number') ? new Date(date) : date

  if (isInvalidDate(dateResolved)) {
    return null
  }

  const year = String(dateResolved.getFullYear()).padStart(4, '0')
  const month = String(dateResolved.getMonth() + 1).padStart(2, '0')
  const day = String(dateResolved.getDate()).padStart(2, '0')

  const hours = String(dateResolved.getHours()).padStart(2, '0')
  const minutes = String(dateResolved.getMinutes()).padStart(2, '0')
  const seconds = String(dateResolved.getSeconds()).padStart(2, '0')

  const result = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`

  return result
}


export function formatDateAsFullDate(date: Date | string | undefined | null) {
  if (date == null) {
    return null
  }

  const dateResolved = typeof date === 'string' ? new Date(date) : date

  if (isInvalidDate(dateResolved)) {
    return null
  }

  const year = String(dateResolved.getFullYear()).padStart(4, '0')
  const month = String(dateResolved.getMonth() + 1).padStart(2, '0')
  const day = String(dateResolved.getDate()).padStart(2, '0')

  const result = `${day}/${month}/${year}`

  return result
}
