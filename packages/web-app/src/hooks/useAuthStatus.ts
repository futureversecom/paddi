import type { AuthenticationStatus } from '@rainbow-me/rainbowkit'
import { create } from 'zustand'

type UseAuthStatusState = {
  authStatus: AuthenticationStatus
  setAuthStatus: (status: AuthenticationStatus) => void
}

export const useAuthStatus = create<UseAuthStatusState>(set => ({
  authStatus: 'unauthenticated',
  setAuthStatus: (authStatus: AuthenticationStatus) =>
    set(state => ({ ...state, authStatus })),
}))
