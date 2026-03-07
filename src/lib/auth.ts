import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "thecatalyst@energypulse.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL || "thecatalyst@energypulse.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "catalyst2025";
        
        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          let author = await db.author.findUnique({ 
            where: { email: adminEmail } 
          });
          
          if (!author) {
            author = await db.author.create({
              data: {
                email: adminEmail,
                name: "thecatalyst",
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
