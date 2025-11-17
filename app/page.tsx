'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  QrCode,
  Smartphone,
  Settings,
  Globe,
  BarChart,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">QR Menu</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/menu/demo-bistro" className="text-gray-600 hover:text-gray-900 transition-colors">
              Demo Menü
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
              Yönetim Paneli
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Restoranınız için{' '}
              <span className="text-red-600">modern QR menü</span> sistemi
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Kağıt menülere veda edin. Müşterileriniz telefonlarından menünüzü görüntülesin.
              Kolay yönetim paneli ile menünüzü anında güncelleyin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/menu/demo-bistro">
                <Button size="lg" className="w-full sm:w-auto">
                  Hemen Deneyin
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Yönetim Panelini Gör
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-slide-up">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Demo Bistro</h3>
                      <p className="text-sm text-gray-500">QR Menü Önizleme</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Kahvaltılıklar</span>
                        <span className="text-xs text-gray-500">8 ürün</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Pizzalar</span>
                        <span className="text-xs text-gray-500">5 ürün</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">İçecekler</span>
                        <span className="text-xs text-gray-500">12 ürün</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-gray-900" />
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                      QR kodu okutarak menüyü görüntüleyin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden QR Menu?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern restoranlar için tasarlanmış, kullanımı kolay ve güçlü özellikler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ImageIcon className="w-8 h-8" />}
              title="Görsel Kütüphane"
              description="Profesyonel yemek fotoğrafları ile menünüzü zenginleştirin. Her ürün için özel görseller ekleyin."
            />
            <FeatureCard
              icon={<Settings className="w-8 h-8" />}
              title="Kolay Yönetim Paneli"
              description="Kullanıcı dostu arayüz ile menünüzü dakikalar içinde oluşturun ve güncelleyin."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Çoklu Dil Desteği"
              description="Türkçe ve İngilizce dillerinde menünüzü sunun. Yabancı misafirleriniz de kolayca sipariş versin."
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8" />}
              title="Tüm Cihazlarda Mükemmel"
              description="Mobil, tablet ve desktop cihazlarda kusursuz görünüm. Responsive tasarım garantisi."
            />
            <FeatureCard
              icon={<QrCode className="w-8 h-8" />}
              title="Anında QR Kod"
              description="Restoranınıza özel QR kod oluşturun, indirin ve masalarınıza yerleştirin."
            />
            <FeatureCard
              icon={<BarChart className="w-8 h-8" />}
              title="Raporlama Altyapısı"
              description="Gelecekte eklenecek analitik özellikler ile menü performansınızı takip edin."
            />
          </div>
        </div>
      </section>

      {/* Image Library Teaser */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Profesyonel Görseller
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Menünüze görsel zenginlik katın, müşterilerinizin iştahını kabartın
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden group">
                <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fiyatlandırma
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              İşletmenizin ihtiyacına uygun planı seçin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              name="Başlangıç"
              price="299"
              period="aylık"
              features={[
                'Tek restoran',
                'Sınırsız kategori',
                'Sınırsız ürün',
                'QR kod oluşturma',
                'Çoklu dil desteği',
                'Temel destek'
              ]}
            />
            <PricingCard
              name="Profesyonel"
              price="599"
              period="aylık"
              featured
              features={[
                '3 restoran',
                'Sınırsız kategori',
                'Sınırsız ürün',
                'QR kod oluşturma',
                'Çoklu dil desteği',
                'Öncelikli destek',
                'Özel tema renkleri',
                'İstatistikler'
              ]}
            />
            <PricingCard
              name="Kurumsal"
              price="Özel"
              period="fiyat"
              features={[
                'Sınırsız restoran',
                'Sınırsız kategori',
                'Sınırsız ürün',
                'QR kod oluşturma',
                'Çoklu dil desteği',
                '7/24 destek',
                'Özel tema renkleri',
                'Detaylı raporlar',
                'API erişimi'
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="QR menü nasıl çalışır?"
              answer="QR menü, müşterilerinizin akıllı telefonlarıyla masanızdaki QR kodu okutarak menünüzü görüntülemesini sağlar. Herhangi bir uygulama indirmeye gerek yoktur, doğrudan tarayıcıdan açılır."
            />
            <FAQItem
              question="Menümü güncellemek kolay mı?"
              answer="Evet, yönetim panelinizden menünüze istediğiniz zaman yeni ürünler ekleyebilir, fiyatları güncelleyebilir veya kategorileri düzenleyebilirsiniz. Değişiklikler anında yayına alınır."
            />
            <FAQItem
              question="Kaç dilde menü sunabilirim?"
              answer="Şu anda Türkçe ve İngilizce dil desteği sunuyoruz. Müşterileriniz menüde dil seçeneği ile istedikleri dilde görüntüleyebilir."
            />
            <FAQItem
              question="QR kodunu nasıl alabilirim?"
              answer="Yönetim panelinizden restoranınıza özel QR kodunu oluşturabilir, PNG formatında indirebilir ve masalarınıza yazdırıp yerleştirebilirsiniz."
            />
            <FAQItem
              question="Mobil uyumlu mu?"
              answer="Kesinlikle! QR menü sistemi mobil-first yaklaşımla tasarlanmıştır. Tüm akıllı telefonlar, tabletler ve bilgisayarlarda mükemmel görünüm sunar."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card hover className="p-6">
      <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  )
}

function PricingCard({
  name,
  price,
  period,
  features,
  featured = false
}: {
  name: string
  price: string
  period: string
  features: string[]
  featured?: boolean
}) {
  return (
    <Card className={`p-8 ${featured ? 'ring-2 ring-red-600 shadow-2xl scale-105' : ''}`}>
      {featured && (
        <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
          ÖNERİLEN
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        {price !== 'Özel' && <span className="text-gray-600 ml-1">₺</span>}
        <span className="text-gray-600 ml-2">/ {period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={featured ? 'primary' : 'outline'}
        className="w-full"
      >
        Başlayın
      </Button>
    </Card>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-gray-600 animate-slide-down">
          {answer}
        </div>
      )}
    </Card>
  )
}
