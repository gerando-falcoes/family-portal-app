import { AuthGuard } from '@/components/auth-guard'

export default function FamiliaLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}

