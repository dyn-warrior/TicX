import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    username: string
    rating: number
  }

  interface Session {
    user: {
      id: string
      email: string
      username: string
      rating: number
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    rating: number
  }
}
