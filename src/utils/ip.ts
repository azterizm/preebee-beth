import { redis } from '../config/db'

export async function getIPInformation(ip: string) {
  if (process.env.NODE_ENV === 'development') {
    return {
      status: 'success',
      countryCode: 'PK',
      regionName: 'Sindh',
      city: 'Hyderabad',
    }
  }
  const cached = await redis.get(ip)
  if (cached) {
    return JSON.parse(cached) as IPInformation
  }
  const response = await fetch(
    `http://ip-api.com/json/${ip}?fields=status,message,countryCode,regionName,city`,
  )
  const data = await response.json()
  await redis.setex(ip, 60 * 60 * 24 * 30, JSON.stringify(data))
  return data as IPInformation
}

interface IPInformation {
  status: string
  message: string
  countryCode: string
  regionName: string
  city: string
}
