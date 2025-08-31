import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Simulation auth - remplacer par vraie vérification DB
        const users = [
          { id: "1", email: "admin@test.com", name: "Admin", role: "ADMIN" as Role },
          { id: "2", email: "manager@test.com", name: "Manager", role: "MANAGER" as Role },
          { id: "3", email: "artisan@test.com", name: "Artisan", role: "ARTISAN" as Role },
          { id: "4", email: "client@test.com", name: "Client", role: "CLIENT" as Role },
        ];

        const user = users.find(u => u.email === credentials.email);
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
};
