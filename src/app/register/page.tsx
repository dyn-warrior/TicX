import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RegisterForm } from '@/components/auth/register-form'

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/play')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border-2 border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-40 h-40 border-2 border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-20 h-20 border-2 border-white/20 rounded-full"></div>
        
        {/* Mandala-like patterns */}
        <div className="absolute top-20 right-32 opacity-20">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="2"/>
            <circle cx="60" cy="60" r="30" stroke="white" strokeWidth="1"/>
            <circle cx="60" cy="60" r="15" stroke="white" strokeWidth="1"/>
            <path d="M60 10 L65 45 L60 50 L55 45 Z" fill="white"/>
            <path d="M110 60 L75 65 L70 60 L75 55 Z" fill="white"/>
            <path d="M60 110 L55 75 L60 70 L65 75 Z" fill="white"/>
            <path d="M10 60 L45 55 L50 60 L45 65 Z" fill="white"/>
          </svg>
        </div>
        
        <div className="absolute bottom-40 left-20 opacity-15">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2"/>
            <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1"/>
            <circle cx="50" cy="50" r="10" stroke="white" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome!</h1>
          <h2 className="text-2xl font-semibold text-white/90">Signup</h2>
          <p className="text-white/70 mt-2">Create your account to start playing TicX</p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  )
}
