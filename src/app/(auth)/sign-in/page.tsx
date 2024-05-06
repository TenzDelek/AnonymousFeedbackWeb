'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button  className=" bg-orange-500 py-2 rounded-lg px-4"  onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className=" bg-orange-500 py-2 rounded-lg px-4 m-4" onClick={() => signIn()}>Sign in</button>
    </>
  )
}