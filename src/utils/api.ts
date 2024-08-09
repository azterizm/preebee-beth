export function handleStringNumber(value: any) {
  return !value
    ? 0
    : isNaN(parseInt(value.toString()))
    ? 0
    : parseInt(value.toString())
}
