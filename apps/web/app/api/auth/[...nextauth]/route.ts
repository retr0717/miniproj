import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as Auth from "@/lib/auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Missing credentials");
        }
        return await Auth.login({ credentials }); // Calls the frontend `auth.ts` function
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {

      console.log("session callback", session, token);

      if (token?.user) {
        session.user = token.user; // Attach the user data to the session
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.user = user; // Add user data to JWT token
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "looselipssinkships",
  pages: {
    signIn: "/auth/login", // Custom login page,
    signOut: "/auth/login", // Custom logout page
  },
});

export { handler as GET, handler as POST }