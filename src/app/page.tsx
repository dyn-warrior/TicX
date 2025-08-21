import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { Header } from '@/components/header'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/play')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  )
}
