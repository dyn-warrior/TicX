import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Skill-Based <span className="text-indigo-600">Tic-Tac-Toe</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Play 1v1 Tic-Tac-Toe with real stakes. Choose your entry amount, apply leverage, 
          and compete for fair payouts in this skill-based game.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Playing
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </Link>
        </div>
        
        {/* Game Preview */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-sm mx-auto">
          <h3 className="text-lg font-semibold mb-4">Demo Game Board</h3>
          <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className="w-16 h-16 border-2 border-gray-300 rounded-md flex items-center justify-center text-2xl font-bold bg-gray-50"
              >
                {i === 0 ? 'X' : i === 4 ? 'O' : i === 8 ? 'X' : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
