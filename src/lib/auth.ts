import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }
  interface JWT {
    role?: string;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@foo.com' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'boolean' },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials.email !== 'string' ||
          typeof credentials.password !== 'string'
        ) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || typeof user.password !== 'string') {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.email,
          role: user.role,
          rememberMe: credentials.rememberMe === 'true' || credentials.rememberMe === true,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    session({ session, token }) {
      if (session.user && typeof token.sub === 'string') {
        session.user.id = token.sub;
        if (typeof token.role === 'string') {
          session.user.role = token.role;
        }
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        if ('role' in user && typeof user.role === 'string') {
          token.role = user.role;
        }
        
        // Handle Remember Me
        if ('rememberMe' in user) {
          const rememberMe = user.rememberMe as boolean;
          // Set expiration: 30 days if rememberMe, 4 hours otherwise
          const expirationTime = rememberMe 
            ? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 
            : Math.floor(Date.now() / 1000) + 4 * 60 * 60;
          token.exp = expirationTime;
        }
      }
      return token;
    },
  },
});
