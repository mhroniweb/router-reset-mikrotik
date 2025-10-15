import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User, { IUser } from "@/models/User";
import { logSecurityEvent, SecurityEventType } from "@/lib/security-logger";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "NEXTAUTH_SECRET is not set. Please set it in your .env.local file. " +
      "Generate one with: openssl rand -base64 32"
  );
}

if (!process.env.NEXTAUTH_URL) {
  throw new Error(
    "NEXTAUTH_URL is not set. Please set it in your .env.local file. " +
      "Example: http://localhost:3000"
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        await connectDB();

        // Find user
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          logSecurityEvent({
            event: SecurityEventType.LOGIN_FAILURE,
            details: { email: credentials.email, reason: "User not found" },
            severity: "warning",
          });
          throw new Error("Invalid email or password");
        }

        // Check password
        const isValid = await user.comparePassword(credentials.password);

        if (!isValid) {
          logSecurityEvent({
            event: SecurityEventType.LOGIN_FAILURE,
            userId: user._id.toString(),
            details: { email: credentials.email, reason: "Invalid password" },
            severity: "warning",
          });
          throw new Error("Invalid email or password");
        }

        // Log successful login
        logSecurityEvent({
          event: SecurityEventType.LOGIN_SUCCESS,
          userId: user._id.toString(),
          details: { email: credentials.email },
          severity: "info",
        });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours (reduced from 24 hours for security)
    updateAge: 60 * 60, // Update token every hour
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as IUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as IUser).id = token.id as string;
        (session.user as IUser).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
