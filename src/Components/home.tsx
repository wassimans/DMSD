import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status, update } = useSession();
  if (status === "authenticated") {
    return (
      <>
        {/* <p>Signed in as {session.!user.!name}</p> */}

        {/* Update the value by sending it to the backend. */}
        <button onClick={() => update({ name: "John Doe" })}>Edit name</button>
        {/*
         * Only trigger a session update, assuming you already updated the value server-side.
         * All `useSession().data` references will be updated.
         */}
        <button onClick={() => update()}>Edit name</button>
        <pre>{JSON.stringify(session.user, null, 2)}</pre>
        <button onClick={() => signOut({ redirect: true })}>Sign out</button>
      </>
    );
  }

  return <a href="/api/auth/signin">Sign in</a>;
}
