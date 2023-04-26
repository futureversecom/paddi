import { GraphQLClient } from 'graphql-request'
import jwtDecode from 'jwt-decode'

// TODO: Generate endpoint env in CICD
const endpoint =
  import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000/graphql'

interface DecodedToken {
  sub: string
}

export const JWTLocalStorageKey = 'acp-demo-token'

const initJWTToken = localStorage.getItem(JWTLocalStorageKey) ?? null

export const client = new GraphQLClient(endpoint, {
  headers: {
    ...(initJWTToken ? { Authorization: `Bearer ${initJWTToken}` } : {}),
  },
})

export const getInitAuthStatus = (address?: string) => {
  if (!initJWTToken) {
    return false
  }
  const decodedToken = jwtDecode<DecodedToken>(initJWTToken)
  if (
    decodedToken?.sub &&
    decodedToken.sub.toLowerCase() === address?.toLowerCase()
  ) {
    return true
  }
  clearJwt()
  return false
}

export const setJwt = (token: string) => {
  localStorage.setItem(JWTLocalStorageKey, token)
  client.setHeader('Authorization', `Bearer ${token}`)
}

export const clearJwt = () => window.localStorage.removeItem(JWTLocalStorageKey)
