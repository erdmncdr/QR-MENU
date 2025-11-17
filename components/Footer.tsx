import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">QR Menu</h3>
            <p className="text-gray-400 text-sm">
              Restoranınız için modern QR menü sistemi. Kolay yönetim, sınırsız menü.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/menu/demo-bistro" className="hover:text-white transition-colors">
                  Demo Menü
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Yönetim Paneli
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">İletişim</h4>
            <p className="text-gray-400 text-sm">
              Sorularınız için bizimle iletişime geçin.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              info@qrmenu.com
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; 2025 QR Menu. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
