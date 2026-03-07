# EnergyPulse - Energy Issues Blog

A modern energy news blog built with Next.js 16, TypeScript, Tailwind CSS, and PostgreSQL.

## 🚀 Features

- 📰 **Blog Management** - Create, edit, publish articles
- 🤖 **AI Image Generation** - Auto-generate cover images
- 🔐 **User Authentication** - Secure admin access
- 📱 **Social Sharing** - Twitter, Facebook, LinkedIn, Email
- 🎨 **Modern UI** - Responsive, dark/light mode
- 🗂️ **Categories & Tags** - Organize content
- 💾 **PostgreSQL** - Scalable database

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **AI**: z-ai-web-dev-sdk (image generation)

## 📦 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd energypulse
bun install
```

### 2. Set Up Database

Create a PostgreSQL database (use Neon, Supabase, or local PostgreSQL):

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://..."
```

### 3. Initialize Database

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Seed with sample data
bun run db:seed
```

### 4. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Admin Login

Default credentials:
- **Email**: `admin@energypulse.com`
- **Password**: `admin123`

⚠️ **Change these in production!**

## 🚀 Deploy to Vercel

### Step 1: Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/energypulse.git
git push -u origin main
```

### Step 2: Create PostgreSQL Database

**Option A: Neon (Free)**
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy the connection string

**Option B: Supabase (Free)**
1. Go to [supabase.com](https://supabase.com)
2. Create free project
3. Go to Settings → Database
4. Copy connection string (enable connection pooling)

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Add environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `DIRECT_DATABASE_URL` | Same as DATABASE_URL (for migrations) |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL (e.g., `https://your-app.vercel.app`) |

5. Click "Deploy"
6. Wait for build to complete

### Step 4: Seed Database

After deployment, run the seed script:

```bash
# Set production database URL
export DATABASE_URL="your-production-database-url"
bun run db:seed
```

Or use Vercel CLI:

```bash
vercel env pull .env.production
bun run db:seed
```

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Homepage
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   ├── AdminDashboard.tsx
│   │   ├── SessionProvider.tsx
│   │   └── SocialShare.tsx
│   └── lib/
│       ├── auth.ts      # NextAuth config
│       ├── db.ts        # Prisma client
│       └── utils.ts     # Utilities
├── public/
│   └── uploads/         # Generated images
└── package.json
```

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_DATABASE_URL` | For Prisma migrations |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `NEXTAUTH_SECRET` | Random secret for JWT |
| `NEXTAUTH_URL` | Your app's URL |

## 📝 License

MIT License - feel free to use for your own projects!

## 🙏 Credits

Built with ❤️ using Next.js, Prisma, and shadcn/ui
