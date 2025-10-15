# MikroTik Router Reset System

A modern, full-stack web application built with Next.js to manage MikroTik routers and reset hotspot users.

## Features

- 🔐 **Secure Authentication** - Admin login with NextAuth.js
- 🖥️ **Router Management** - Add, view, and delete MikroTik routers
- 🔄 **User Reset** - Reset hotspot users with flexible options:
  - Remove from active connections
  - Clear hotspot cookies
  - Remove MAC address bindings
- 🔒 **Encrypted Storage** - Router credentials stored with AES-256 encryption
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- ⚡ **Real-time Feedback** - Toast notifications and operation results

## Tech Stack

- **Next.js 15** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development
- **MongoDB** - Database with Mongoose ODM
- **NextAuth.js** - Authentication
- **node-routeros** - MikroTik API client
- **TailwindCSS** - Styling
- **React Hot Toast** - Notifications

## Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud)
- MikroTik router with API access enabled

## Installation

1. **Clone the repository** (or extract the files)

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/mikrotik-reset-system

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-minimum-32-characters-long-random-string

   # Encryption Key (32 characters)
   ENCRYPTION_KEY=your-32-character-encryption-key

   # Initial Admin Credentials
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

   **Important:** Generate secure random strings for `NEXTAUTH_SECRET` and `ENCRYPTION_KEY` in production!

4. **Generate secure keys**

   ```bash
   # For NEXTAUTH_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

   # For ENCRYPTION_KEY (32 chars)
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```

5. **Seed the admin user**

   ```bash
   npx tsx scripts/seed-admin.ts
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### First Time Setup

1. **Login** with the default credentials:

   - Email: `admin@example.com`
   - Password: `admin123`

2. **Add a Router**
   - Go to "Routers" page
   - Click "Add Router"
   - Fill in your MikroTik router details:
     - Name: Friendly name for the router
     - IP Address: Router's IP address
     - Username: Admin username for API access
     - Password: Admin password
     - Port: API port (default: 8728)

### Resetting Users

1. Go to the **Dashboard**
2. Select a router from the dropdown
3. Enter the hotspot username to reset
4. Choose operations (all selected by default):
   - ✓ Remove from Active Connections
   - ✓ Remove Hotspot Cookies
   - ✓ Remove MAC Address Bindings
5. Click "Reset User"
6. View the operation results

## MikroTik Configuration

Ensure your MikroTik router has the API enabled:

```
/ip service
set api address=0.0.0.0/0 disabled=no port=8728
```

**Security Note:** In production, restrict API access to specific IPs!

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoints
│   │   ├── routers/                # Router CRUD API
│   │   └── reset-user/             # User reset API
│   ├── dashboard/                  # Main dashboard page
│   ├── routers/                    # Router management page
│   ├── login/                      # Login page
│   └── layout.tsx                  # Root layout
├── components/
│   ├── Navbar.tsx                  # Navigation bar
│   ├── RouterForm.tsx              # Add router form
│   ├── RouterList.tsx              # Router list table
│   └── UserResetForm.tsx           # User reset interface
├── lib/
│   ├── db.ts                       # MongoDB connection
│   ├── mikrotik.ts                 # MikroTik helper functions
│   ├── crypto.ts                   # Encryption utilities
│   └── auth.ts                     # Auth helpers
├── models/
│   ├── User.ts                     # Admin user model
│   └── Router.ts                   # Router model
└── scripts/
    └── seed-admin.ts               # Admin seeding script
```

## Security Considerations

- Router passwords are encrypted with AES-256-CBC before storage
- Admin passwords are hashed with bcrypt
- All routes except login are protected by authentication
- API validates all inputs
- Passwords are never exposed to the frontend

## Production Deployment

### Environment Variables

Update `.env.local` for production:

- Use a strong, random `NEXTAUTH_SECRET`
- Use a secure 32-character `ENCRYPTION_KEY`
- Change default admin credentials
- Use a production MongoDB connection string
- Update `NEXTAUTH_URL` to your domain

### Recommended Platforms

- **Vercel** (easiest for Next.js)
- **Railway**
- **DigitalOcean App Platform**
- **AWS/Azure/GCP**

### Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Connection Errors

- Verify MikroTik router API is enabled and accessible
- Check firewall rules on the router
- Ensure correct IP address, username, and password
- Test API port is open (default: 8728)

### Database Errors

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- Verify network connectivity to MongoDB

### Authentication Issues

- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set
- Verify admin user was created with seed script

## Development

### Add New Admin User

```bash
ADMIN_EMAIL=newadmin@example.com ADMIN_PASSWORD=newpass123 npx tsx scripts/seed-admin.ts
```

### Run Linter

```bash
npm run lint
```

## License

MIT License - feel free to use this project for your needs.

## Support

For issues or questions, please refer to:

- MikroTik API Documentation
- Next.js Documentation
- MongoDB Documentation

---

Built with ❤️ using Next.js and TypeScript
