# Database Setup Guide for DoorWin Craft

## Option 1: Supabase (Recommended - Free)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Database Credentials
1. In your Supabase dashboard, go to **Settings** → **Database**
2. Copy the **Connection string** (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
3. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 3: Update Environment Variables
Replace the DATABASE_URL in your `.env.local` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

### Step 4: Run Database Setup Commands
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) View your database
npx prisma studio
```

## Option 2: Railway (Alternative - Free)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up for a free account
3. Create a new PostgreSQL database

### Step 2: Get Connection String
1. Click on your PostgreSQL service
2. Go to **Connect** tab
3. Copy the **Connection URL**

### Step 3: Update Environment Variables
```env
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:xxxx/postgres"
```

## Option 3: Local PostgreSQL

### Step 1: Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt install postgresql postgresql-contrib`

### Step 2: Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE doorwin_craft;

# Create user (optional)
CREATE USER doorwin_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE doorwin_craft TO doorwin_user;
```

### Step 3: Update Environment Variables
```env
DATABASE_URL="postgresql://doorwin_user:your_password@localhost:5432/doorwin_craft"
```

## After Database Setup

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Push Schema to Database
```bash
npx prisma db push
```

### 3. (Optional) Seed Database
```bash
npx prisma db seed
```

### 4. View Database (Optional)
```bash
npx prisma studio
```

## Testing Database Connection

### 1. Restart Development Server
```bash
npm run dev
```

### 2. Test Registration
- Go to `/register`
- Create a new account
- Check if user is created in database

### 3. Test Login
- Go to `/login`
- Use the credentials you just created
- Verify authentication works

## Database Schema

The database includes these main tables:
- **User**: User accounts with trial/subscription management
- **Account**: OAuth accounts (for future social login)
- **Session**: User sessions
- **Design**: User-created window/door designs
- **Quote**: Pricing quotes for designs
- **Order**: Customer orders
- **Payment**: Payment records
- **Product**: Product catalog

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Check if database URL is correct
   - Verify database is running
   - Check firewall settings

2. **Authentication Failed**
   - Verify username/password in connection string
   - Check if user has proper permissions

3. **Schema Sync Issues**
   - Run `npx prisma db push` to sync schema
   - Check for migration conflicts

4. **NextAuth Errors**
   - Ensure DATABASE_URL is set correctly
   - Restart development server after changes

## Production Considerations

### Security:
- Use strong passwords
- Enable SSL connections
- Set up proper user permissions
- Use connection pooling

### Performance:
- Add database indexes for frequently queried fields
- Consider read replicas for high traffic
- Monitor query performance

### Backup:
- Set up automated backups
- Test restore procedures
- Keep multiple backup copies

## Support

If you encounter issues:
1. Check the Prisma documentation
2. Verify your database connection
3. Check the NextAuth.js documentation
4. Review the error logs in your terminal



