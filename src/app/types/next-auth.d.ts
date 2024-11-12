import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user: {
        id: string;
        username: string;
        email: string;
        userType: "ROLE_ADMIN" | "ROLE_USER";
      };
      jwt: string;
    };
  }
}
