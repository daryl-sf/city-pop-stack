import type { MetaFunction } from "@remix-run/node";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "City Pop Stack" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      {user ? <h1>Hello user</h1> : <h1>Hello world</h1>}
    </main>
  );
}
