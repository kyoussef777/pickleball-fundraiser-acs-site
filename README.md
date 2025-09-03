# Pickleball for Prostate Cancer Tournament Website

A Next.js application for managing a pickleball tournament fundraiser partnered with the American Cancer Society.

## Features

- **Tournament Registration**: Participants can register and donate to ACS
- **Volunteer Management**: Volunteer sign-up and coordination
- **Sponsor Management**: Dynamic sponsor display and admin management
- **Admin CMS**: Complete content management system for event organizers
- **Database Integration**: PostgreSQL with Prisma ORM
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd pickleball-fundraiser
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: Your Neon database connection string
- `DIRECT_URL`: Your Neon direct database connection string
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password
- `ADMIN_PASSWORD_SALT`: Salt for password hashing
- `JWT_SECRET`: JWT signing secret

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Deploy migrations (production)
npm run db:migrate
```

## Deployment to Vercel

1. **Connect your repository to Vercel**

2. **Set environment variables in Vercel dashboard**:
   - DATABASE_URL
   - DIRECT_URL  
   - ADMIN_USERNAME
   - ADMIN_PASSWORD
   - ADMIN_PASSWORD_SALT
   - JWT_SECRET

3. **Deploy**
   Vercel will automatically build and deploy your application.

## Admin Panel

Access the admin panel at `/admin` with the credentials set in your environment variables.

**Admin Features:**
- View and export participant data
- Manage volunteers
- Add/remove sponsors
- Update event settings
- Content management

## API Endpoints

- `GET/POST /api/participants` - Tournament participants
- `GET/POST /api/volunteers` - Event volunteers  
- `GET/POST/DELETE /api/sponsors` - Sponsor management
- `GET/PUT /api/settings` - Event settings
- `POST /api/admin/auth` - Admin authentication

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/           # API routes
│   ├── donate/        # Registration & donation page
│   ├── sponsors/      # Sponsors page
│   ├── volunteer/     # Volunteer signup
│   └── page.tsx       # Home page
├── components/        # Reusable components
├── lib/              # Utilities and configurations
└── prisma/           # Database schema and migrations
```

## Contact

For questions about the tournament or technical issues:
**Mark Dawod** - [markrdawod@gmail.com](mailto:markrdawod@gmail.com)
