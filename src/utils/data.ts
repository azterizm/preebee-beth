export function findAverage(data: number[]): number {
  const res = data.reduce((a, b) => a + b, 0) / data.length
  return isNaN(res) ? 0 : res
}

export function formatCurrency(arg?: number | string) {
  return Intl.NumberFormat('en-US').format(!arg ? 0 : Number(arg))
}
