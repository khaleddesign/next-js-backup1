import '@testing-library/jest-dom'

jest.mock('next-auth', () => ({
  default: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

global.fetch = jest.fn()

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
})

beforeEach(() => {
  global.fetch.mockClear()
  window.localStorage.getItem.mockClear()
  window.localStorage.setItem.mockClear()
  window.localStorage.removeItem.mockClear()
})
