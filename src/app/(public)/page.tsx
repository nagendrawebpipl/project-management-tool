import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Collaborate, manage, and deliver.
      </h1>
      <p className="text-xl text-slate-600 mb-8 max-w-2xl">
        The all-in-one project management tool designed for high-performance software teams.
      </p>
      <div className="flex gap-4">
        <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
          Get Started Free
        </Link>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Sign In
        </Link>
      </div>
    </div>
  )
}
