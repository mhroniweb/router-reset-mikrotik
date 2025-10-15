# Quick Start Guide

Get your MikroTik Router Reset System up and running in 5 minutes!

## Prerequisites Check

- ✅ Node.js 18+ installed
- ✅ MongoDB installed or MongoDB Atlas account
- ✅ MikroTik router with admin access

## 1. Create `.env.local` File

Create a file named `.env.local` in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/mikrotik-reset-system
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-32-char-string-using-command-below
ENCRYPTION_KEY=generate-32-chars-using-command-below
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Generate Secure Keys

```bash
# For NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# For ENCRYPTION_KEY (copy output and paste in .env.local)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## 2. Start MongoDB

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## 3. Create Admin User

```bash
npm run seed
```

Expected output: `✅ Admin user created successfully`

## 4. Start the App

```bash
npm run dev
```

## 5. Open Browser

Go to: [http://localhost:3000](http://localhost:3000)

Login with:

- Email: `admin@example.com`
- Password: `admin123`

## 6. Add Your First Router

1. Click "Routers" in the navbar
2. Click "+ Add Router"
3. Fill in your MikroTik router details:
   - **Name:** My Router
   - **IP Address:** 192.168.88.1 (your router's IP)
   - **Username:** admin
   - **Password:** (your router password)
   - **Port:** 8728

## 7. Reset a User

1. Go to "Dashboard"
2. Select your router
3. Enter a hotspot username
4. Click "Reset User"

## That's it! 🎉

You're now ready to manage your MikroTik hotspot users!

---

**Need help?** Check [SETUP.md](SETUP.md) or [README.md](README.md) for detailed instructions.
