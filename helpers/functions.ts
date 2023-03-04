export const shortFullname = (fullname: string): string => {
  if (!fullname) return ''
  const arr = fullname.split(' ')
  const result = arr[0] + ' ' + (arr[1] ? arr[1][0] + '. ' : '') + (arr[2] ? arr[2][0] + '.' : '')
  return result.trim()
}

export const isNumber = (value) => typeof value === 'number' && Number.isFinite(value)

export const joinPhones = (phones) => (phones ? `|${phones.join(', ')}|` : '')

export const round = (value) => Math.round(Number(value) * 100) / 100

export function arrayUnique(A: Array<unknown>) {
  if (!A) return false
  const n = A.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      if (A[i] === A[j]) return false
    }
  }
  return true
}

export const strToBool = (value: string): boolean => (value === 'true' ? true : false)

/**
 * cut numbers after dot
 * @param {float} float
 * @param {number} fix how much numbers should be keep after fix, default = float.length
 * @returns {float} float
 */
export const cutFloat = (float: number, fix?: number): number => {
  const flt = float.toString()
  const index = flt.indexOf('.')
  const len = flt.length
  !fix && (fix = len)

  return parseFloat(flt.slice(0, index === -1 ? len : index + fix + 1))
}

export const removeArrSameItems = (arr: Array<number>) => arr.filter((e, i) => arr.indexOf(e) === i)

export const removeArrSameObjects = <T>(arr: T[], key: string) =>
  arr.filter((e, i, a) => a.findIndex((e2) => e2[key] === e[key]) === i)
