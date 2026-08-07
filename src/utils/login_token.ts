import Cookies from 'js-cookie'

const TokenKey = 'adminSessionId'

export function getToken(): string | undefined {
  return Cookies.get(TokenKey)
}

export function setToken(token: string): string {
  return Cookies.set(TokenKey, token)
}

export function removeToken(): void {
  Cookies.remove(TokenKey)
}
