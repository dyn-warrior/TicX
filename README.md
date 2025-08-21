# TicX - Skill-Based Tic-Tac-Toe

A production-ready skill-based 1v1 Tic-Tac-Toe game with wallet credits, leverage system, and real-time multiplayer gameplay.

## Features

- 🎮 Real-time 1v1 Tic-Tac-Toe gameplay
- 💰 Wallet system with credits and leverage (×1 to ×5)
- 🎯 Skill-based matchmaking by effective entry amount
- 🔒 Secure authentication with NextAuth
- 🏦 Fair payout system with platform fees
- 📊 Comprehensive match history and analytics
- 🛡️ Admin dashboard for user management
- 🎲 Anti-cheat and fair play mechanisms

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma, PostgreSQL
- **Real-time**: Socket.IO for gameplay
- **Authentication**: NextAuth with email/password
- **Caching**: Upstash Redis for queues and rate limiting
- **Testing**: Vitest (unit), Playwright (e2e)
- **Deployment**: Docker Compose

## Quick Start

### Prerequisites

- **Node.js 18+** (Download from https://nodejs.org/)
- **Docker and Docker Compose** (for containerized development)
- **PostgreSQL** (if running without Docker)

### Installation Steps

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/
   - Install and restart your terminal
   - Verify with: `node --version` and `npm --version`

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

4. **Setup database** (choose one option):

   **Option A: With Docker (Recommended)**
   ```bash
   # Start all services
   make up
   
   # Or using docker-compose directly
   docker-compose up -d
   ```

   **Option B: Local PostgreSQL**
   ```bash
   # Make sure PostgreSQL is running locally
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the application**:
   ```bash
   # For Docker
   make up
   
   # For local development
   npm run dev
   ```

The app will be available at http://localhost:3000

## Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ticx"

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Redis (Upstash)
REDIS_URL="your-redis-url"

# Game Settings
DRAW_REFUND=full
TURN_MS=20000

# Compliance
RESTRICTED_STATES="AP,TG,TN"
```

## Game Rules

### Entry & Leverage
- Choose a **Base Entry** amount (10, 25, 50, 100, 250 credits)
- Select **Leverage** (×1 to ×5)
- **Effective Entry (E)** = Base Entry × Leverage
- Matchmaking pairs players with identical E values

### Payouts
- **Winner**: Receives 1.5 × E (includes original stake + 0.5E profit)
- **Loser**: Loses 100% of E
- **Platform Fee**: 0.5 × E (taken from loser's stake)
- **Draw**: Both players refunded E (configurable)

### Fair Play
- Server-authoritative gameplay
- 20-second turn timer
- Forfeit on timeout or disconnect
- Anti-collusion detection

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (NextAuth)

### Wallet
- `GET /api/me` - User profile and wallet
- `POST /api/wallet/deposit` - Add credits (dev only)

### Matchmaking
- `POST /api/queue/join` - Join matchmaking queue
- `POST /api/queue/leave` - Leave queue (refund hold)

### Gameplay
- `GET /api/match/[id]` - Match state and moves
- `POST /api/match/[id]/move` - Submit move
- `POST /api/match/[id]/forfeit` - Forfeit match

### History
- `GET /api/history` - Match and transaction history

### Admin
- `GET /api/admin/metrics` - Platform metrics
- `POST /api/admin/user/[id]/ban` - Ban/unban user

## Socket.IO Events

### Client → Server
- `move.submit` - Submit game move
- `match.forfeit` - Forfeit current match

### Server → Client
- `match.found` - Match found, game starting
- `match.state` - Current game state
- `move.accepted` - Move was valid and applied
- `match.end` - Game finished with outcome
- `error` - Error occurred

## Database Schema

Core entities:
- **User**: Authentication and profile
- **Wallet**: Balance and locked funds
- **WalletTransaction**: All financial movements
- **Match**: Game instances and state
- **MatchParticipant**: Player participation
- **Move**: Individual game moves
- **PlatformRevenue**: Fee tracking

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test with UI
npm run test:ui
```

## Security & Compliance

- All financial transactions are atomic and idempotent
- Server-authoritative game validation
- Rate limiting on moves and API calls
- IP-based anti-collusion detection
- Responsible gaming features
- State-wise restrictions (configurable)

## Development

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:migrate     # Create migration
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed test data

# Code quality
npm run lint           # ESLint
npm run type-check     # TypeScript check
```

## Deployment

### Production Environment

Set production environment variables:
- Use secure `NEXTAUTH_SECRET`
- Configure production database
- Set up Upstash Redis
- Configure domain in `NEXTAUTH_URL`

### Docker Production

```bash
# Build production image
docker build -t ticx:latest .

# Run with compose
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run the full test suite
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
