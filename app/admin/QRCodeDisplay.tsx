'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import Button from '@/components/ui/Button'
import { Download } from 'lucide-react'

export default function QRCodeDisplay({
  menuUrl,
  restaurantName,
}: {
  menuUrl: string
  restaurantName: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrDataURL, setQrDataURL] = useState<string>('')

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        menuUrl,
        {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('QR Code generation error:', error)
        }
      )

      QRCode.toDataURL(
        menuUrl,
        {
          width: 512,
          margin: 2,
        },
        (error, url) => {
          if (!error) setQrDataURL(url)
        }
      )
    }
  }, [menuUrl])

  const handleDownload = () => {
    if (qrDataURL) {
      const link = document.createElement('a')
      link.download = `${restaurantName.replace(/\s+/g, '-')}-qr-code.png`
      link.href = qrDataURL
      link.click()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
      <p className="text-sm text-gray-600 text-center break-all">{menuUrl}</p>
      <Button onClick={handleDownload} variant="outline" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        PNG Olarak İndir
      </Button>
    </div>
  )
}
