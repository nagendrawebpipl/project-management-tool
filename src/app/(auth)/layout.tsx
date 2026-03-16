export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
