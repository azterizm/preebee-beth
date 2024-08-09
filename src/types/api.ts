export type DBResult<T extends (...args: any) => any> = Awaited<ReturnType<T>>

export interface AuthUser {
  id: string
  name: string
  profile: {
    imageURL: string
  }
}
