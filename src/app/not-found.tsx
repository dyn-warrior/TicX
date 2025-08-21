import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
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
      </div>

      <div className="relative z-10 text-center max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white/90 mb-4">Page Not Found</h2>
          <p className="text-white/70 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl h-12">
                Go Home
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl h-12"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
