import Link from 'next/link'
import { Home, UtensilsCrossed, Settings, QrCode, Building2 } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">QR Menu</h1>
                <p className="text-sm text-gray-500">Yönetim Paneli</p>
              </div>
            </div>

            <Link
              href="/menu/demo-bistro"
              target="_blank"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Menüyü Görüntüle
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <NavLink href="/admin" icon={<Home className="w-5 h-5" />}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/restaurants" icon={<Building2 className="w-5 h-5" />}>
              Restoranlarım
            </NavLink>
            <NavLink href="/admin/menu" icon={<UtensilsCrossed className="w-5 h-5" />}>
              Menü Yönetimi
            </NavLink>
            <NavLink href="/admin/settings" icon={<Settings className="w-5 h-5" />}>
              Ayarlar
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  )
}
