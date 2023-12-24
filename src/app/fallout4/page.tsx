import Link from "next/link";

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello, Fallout4 Page!</h1>
      <Link href="/fallout4/keys">KEYS</Link>
      <Link href="/fallout4/barterCalculator">BARTER_CALCULATOR</Link>
    </main>
  )
}