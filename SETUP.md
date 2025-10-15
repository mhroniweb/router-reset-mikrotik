# Setup Instructions

## Step 1: Create Environment File

Create a file named `.env.local` in the root directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/mikrotik-reset-system

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-minimum-32-characters-long-random-string

# Encryption Key for Router Passwords (must be 32 characters)
ENCRYPTION_KEY=your-32-character-encryption-key

# Initial Admin Credentials (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Step 2: Generate Secure Keys

**For NEXTAUTH_SECRET** (at least 32 characters):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**For ENCRYPTION_KEY** (exactly 32 characters):

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Copy the generated values and replace them in your `.env.local` file.

## Step 3: Start MongoDB

Ensure MongoDB is running on your system:

**Windows:**

```bash
net start MongoDB
```

**macOS (Homebrew):**

```bash
brew services start mongodb-community
```

**Linux:**

```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas** (cloud):

- Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Get your connection string and update `MONGODB_URI` in `.env.local`

## Step 4: Seed Admin User

Run the seeding script to create the initial admin user:

```bash
npm run seed
```

You should see: `✅ Admin user created successfully`

## Step 5: Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Login

Use the default credentials:

- **Email:** `admin@example.com`
- **Password:** `admin123`

## Step 7: Configure MikroTik Router

Ensure your MikroTik router has the API enabled:

```routeros
/ip service
set api address=0.0.0.0/0 disabled=no port=8728
```

**Security Warning:** In production, restrict API access to specific IP addresses!

```routeros
/ip service
set api address=192.168.1.100/32 disabled=no port=8728
```

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**

- Check if MongoDB is running
- Verify the `MONGODB_URI` in `.env.local`
- Try: `mongodb://127.0.0.1:27017/mikrotik-reset-system`

### NextAuth Error

**Error:** `[next-auth][error][NO_SECRET]`

**Solution:**

- Ensure `NEXTAUTH_SECRET` is set in `.env.local`
- Generate a new secret using the command in Step 2

### Cannot Connect to Router

**Error:** `Failed to connect to router`

**Solution:**

- Verify router IP address is correct
- Check if API service is enabled on MikroTik
- Test connectivity: `ping <router-ip>`
- Ensure firewall allows connections on port 8728

### Admin Login Fails

**Error:** `Invalid email or password`

**Solution:**

- Run the seed script again: `npm run seed`
- Check if MongoDB is running
- Clear browser cookies

## Next Steps

1. **Add your routers** - Go to the "Routers" page and add your MikroTik routers
2. **Test reset functionality** - Go to "Dashboard" and try resetting a test user
3. **Change admin password** - Update the database with a secure password
4. **Production deployment** - See README.md for deployment instructions

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review MikroTik API documentation
- Check Next.js and MongoDB documentation
