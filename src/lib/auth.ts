import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

// Simple password hashing (in production, use bcrypt)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@energypulse.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check for admin user
        const adminEmail = process.env.ADMIN_EMAIL || "admin@energypulse.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        
        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          // Ensure author exists in database
          let author = await db.author.findUnique({ 
            where: { email: adminEmail } 
          });
          
          if (!author) {
            author = await db.author.create({
              data: {
                email: adminEmail,
                name: "Admin",
                role: "Admin",
                avatar: null,
              }
            });
          }

          return {
            id: author.id,
            name: author.name,
            email: author.email,
            role: author.role,
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "energypulse-secret-key-2025",
};
