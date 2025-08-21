export function Features() {
  const features = [
    {
      title: 'Skill-Based Gameplay',
      description: 'Pure strategy game where skill determines the outcome, not chance.',
    },
    {
      title: 'Leverage System',
      description: 'Choose your leverage (×1 to ×5) to amplify your stakes and rewards.',
    },
    {
      title: 'Fair Payouts',
      description: 'Winner receives 1.5× their stake, with transparent platform fees.',
    },
    {
      title: 'Real-Time Play',
      description: 'Instant matchmaking and live gameplay with turn timers.',
    },
    {
      title: 'Secure Wallet',
      description: 'Safe credit system with locked funds during matches.',
    },
    {
      title: 'Match History',
      description: 'Complete transaction and game history with detailed receipts.',
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose TicX?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the most advanced Tic-Tac-Toe platform with fair play, 
            real money stakes, and competitive gameplay.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
