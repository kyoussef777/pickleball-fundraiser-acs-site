# Pickleball Fundraiser - Neon Database & Vercel Deployment Guide

## 🗄️ Database Setup (Neon)

### 1. Create Neon Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up/Login with GitHub
3. Create a new project named "pickleball-fundraiser"
4. Select PostgreSQL version 15+
5. Choose your region (closest to your users)

### 2. Get Connection Strings
In your Neon dashboard:
1. Go to "Connection Details"
2. Copy the "Connection string" (this is your `DATABASE_URL`)
3. Copy the "Direct connection" string (this is your `DIRECT_URL`)

### 3. Set Environment Variables
Create a `.env` file (copy from `.env.example`):

```bash
# Database URLs from Neon
DATABASE_URL="postgresql://username:password@your-neon-hostname/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@your-neon-hostname/neondb?sslmode=require"

# Admin Authentication
ADMIN_PASSWORD_SALT="your-random-salt-here-generate-this"
JWT_SECRET="your-jwt-secret-here-generate-this"
```

### 4. Run Database Migration
```bash
# Push the schema to your Neon database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## 🚀 Vercel Deployment

### 1. Connect to Vercel
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 2. Set Environment Variables in Vercel
In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these variables:

```
DATABASE_URL = [your-neon-connection-string]
DIRECT_URL = [your-neon-direct-connection-string]
ADMIN_PASSWORD_SALT = [generate-random-string]
JWT_SECRET = [generate-random-string]
```

### 3. Deploy
```bash
vercel --prod
```

## 🎛️ CMS/Admin Features

Your app now has a comprehensive admin panel with:

### ✅ Event Management
- **Event Settings**: Date, time, venue, participant limits
- **Registration Control**: Open/close registration
- **External Links**: ACS donation link, Venmo handle

### ✅ Participant Management  
- **View All Registrations**: Real-time participant list
- **Export Data**: CSV download for all participants
- **Donation Tracking**: Mark donations as completed
- **Skill Level Analytics**: See skill distribution

### ✅ Volunteer Management
- **Volunteer Coordination**: View all volunteer signups
- **Role Assignment**: See preferred roles and availability
- **Contact Management**: Emergency contacts included
- **Export Capabilities**: CSV download for volunteer coordination

### ✅ Sponsor Management
- **Tier System**: Gold ($500) and Platinum ($1,000) tiers  
- **Logo Upload**: Store sponsor logos (ready for image upload integration)
- **Website Links**: Direct links to sponsor websites
- **Display Control**: Enable/disable sponsor visibility

### ✅ Content Management System
- **Dynamic Content**: Edit any text content on the site
- **Content Blocks**: Organized by keys (home_hero, prostate_info, etc.)
- **Rich Text Support**: HTML and Markdown support
- **Version Control**: Track when content was last updated

### ✅ Advanced Features Ready
- **Analytics Tracking**: Page views, registrations, donations
- **Email Templates**: Automated confirmation emails
- **News/Updates**: Announcement system
- **FAQ System**: Frequently asked questions
- **Media Management**: File upload system ready

## 🔧 Admin Panel Access

1. Navigate to `/admin` on your deployed site
2. Default login:
   - Username: `admin` 
   - Password: `pickleballadmin2024`
3. **Change these credentials in production!**

## 📊 Database Models Created

The system includes these comprehensive models:

- **EventSettings**: Main event configuration
- **Participant**: Tournament registrations
- **Volunteer**: Event volunteers  
- **Sponsor**: Event sponsors with tiers
- **ContentBlock**: Editable site content
- **NewsItem**: Announcements and updates
- **FAQ**: Frequently asked questions
- **AdminUser**: Admin authentication
- **EmailTemplate**: Email automation
- **Media**: File management
- **Analytics**: Usage tracking

## 🔒 Security Features

- **Environment Variables**: All secrets properly stored
- **Database Validation**: Prisma type safety
- **Error Handling**: Comprehensive error management
- **Input Sanitization**: Protected against SQL injection
- **Soft Deletes**: Sponsors marked inactive instead of deleted

## 📱 API Endpoints Created

All endpoints support full CRUD operations:

- `GET/PUT /api/settings` - Event configuration
- `GET/POST/PUT/DELETE /api/participants` - Tournament registrations
- `GET/POST/PUT/DELETE /api/volunteers` - Volunteer management
- `GET/POST/PUT/DELETE /api/sponsors` - Sponsor management  
- `GET/POST/PUT/DELETE /api/content` - Content management

## 🚀 Next Steps After Deployment

1. **Set up your Neon database** with the instructions above
2. **Deploy to Vercel** with environment variables
3. **Access admin panel** and customize all content
4. **Add your sponsors** with proper tier information
5. **Configure event settings** with your actual details
6. **Test registration flow** to ensure everything works
7. **Set up email notifications** (optional)

Your site is now a fully-featured CMS with real-time database updates!