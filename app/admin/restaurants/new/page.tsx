import RestaurantForm from '../RestaurantForm'

export default function NewRestaurantPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni Restoran Oluştur</h1>
        <p className="text-gray-600">
          Yeni bir restoran ekleyin ve QR menüsünü oluşturun
        </p>
      </div>

      <RestaurantForm />
    </div>
  )
}
