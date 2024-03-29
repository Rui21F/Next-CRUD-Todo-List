import NextAuth, { getServerSession } from "next-auth/next"
import Credentials from "next-auth/providers/credentials"
import { UserInfo } from "remult"

const auth = NextAuth({
  providers: [
    Credentials({
      credentials: {
        name: {
          placeholder: "Choose Rui or Sara",
        },
      },
      authorize: (credentials) => findUser(credentials?.name) || null,
    }),
  ],
  callbacks: {
    session: ({ session }) => ({
      ...session,
      user: findUser(session.user?.name),
    }),
  },
})
export { auth as GET, auth as POST }

const validUsers: UserInfo[] = [
  { id: "1", name: "Rui", roles: ["admin"] },
  { id: "2", name: "Sara" },
]

function findUser(name?: string | null) {
  return validUsers.find((user) => user.name === name)
}

export async function getUserOnServer() {
  const session = await getServerSession()
  return findUser(session?.user?.name)
}