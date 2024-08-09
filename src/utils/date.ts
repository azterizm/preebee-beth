import RelativeTime from '@yaireo/relative-time'
export function getRelativeTime(arg: string | Date) {
  const r = new RelativeTime()
  return r.from(new Date(arg))
}
