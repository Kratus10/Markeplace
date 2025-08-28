# Next.js Marketplace Application

A production-grade Next.js 15 (App Router) TypeScript single-seller marketplace for downloadable trading tools.

## Features Implemented

1. **User Authentication**
   - Registration with email/password
   - Login with email/password
   - Google OAuth integration
   - Session management with NextAuth.js

2. **User Profile System**
   - Comprehensive profile with avatar, bio, location, gender, birthday, occupation, trading experience
   - Profile editing capabilities
   - Earnings tracking
   - Premium subscription status
   - Privacy controls for profile visibility
   - Rate limiting on profile API endpoints

3. **Messaging System**
   - Private messaging between premium users
   - Message read status tracking
   - Real-time message updates

4. **Community Forum**
   - Topic creation and browsing
   - Category-based organization
   - Comment system
   - View counts and engagement metrics

5. **Premium Subscriptions**
   - Subscription management
   - Premium feature access (messaging)

6. **Role-Based Access Control (RBAC)**
   - Multi-level admin roles (OWNER, ADMIN_L1, ADMIN_L2, MODERATOR, USER)
   - Protected admin routes with middleware
   - Admin L1 dashboard for moderation tasks
   - Audit logging for role changes and content moderation
   - API endpoints for role management and content moderation

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Ensure you have a PostgreSQL database configured
   - Update the `DATABASE_URL` in your `.env` file

3. **Run Prisma Migrations**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Environment Variables**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Key Routes

- `/auth/login` - User login
- `/auth/register` - User registration
- `/profile` - User profile page
- `/messages` - Private messaging (premium users only)
- `/forum` - Community forum
- `/forum/topics/[id]` - Individual forum topics

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### User Profile
- `GET /api/user/profile` - Get user profile (with rate limiting)
- `PUT /api/user/profile` - Update user profile (with rate limiting)
- `GET /api/user/profile-visibility` - Get profile visibility settings (with rate limiting)
- `PUT /api/user/profile-visibility` - Update profile visibility settings (with rate limiting)

### Messaging
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send a new message
- `PUT /api/messages/mark-as-read` - Mark message as read

### Forum
- `GET /api/forum/topics` - Get forum topics
- `POST /api/forum/topics` - Create a new topic
- `GET /api/forum/topics/[id]` - Get a specific topic
- `POST /api/forum/topics/[id]` - Add a comment to a topic
- `GET /api/forum/categories` - Get forum categories

## Development Notes

- All database models are defined in `prisma/schema.prisma`
- Authentication is handled by NextAuth.js with credentials and Google providers
- Premium features are gated by active subscription status
- Messages can only be sent between premium users
- Forum topics and comments are moderated through status fields
- Profile API endpoints include rate limiting to prevent abuse

## Testing

Run the test suite:
```bash
npm test
```

## Profile Page Features

The profile page includes several enhanced features:

1. **Improved UI/UX**
   - Gradient backgrounds for card headers
   - Better spacing and visual hierarchy
   - Responsive design for all screen sizes
   - Loading states with spinner animations
   - Premium badges for premium users

2. **Enhanced Privacy Controls**
   - Toggle switches for each profile field visibility
   - Real-time preview of privacy settings
   - Better organization of privacy controls

3. **Rate Limiting**
   - API endpoints include rate limiting (10 requests per minute)
   - Proper HTTP headers for rate limit information
   - Clear error messages when rate limit is exceeded

4. **Better Error Handling**
   - More descriptive error messages
   - Proper HTTP status codes
   - Graceful degradation when errors occur

For detailed implementation information, see `PROFILE_IMPLEMENTATION_SUMMARY.md`.