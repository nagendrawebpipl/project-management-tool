export async function generateStaticParams() {
  return []
}

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
