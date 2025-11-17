# QR Menu System

A modern, full-stack QR restaurant menu system built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Public Landing Page**: Modern marketing site with hero section, features, pricing, and FAQ
- **Customer Menu View**: Mobile-first responsive menu with language toggle (TR/EN)
- **Admin Dashboard**: Comprehensive management panel for restaurants
- **Menu Management**: Full CRUD operations for categories and items
- **QR Code Generation**: Generate and download QR codes for your menu
- **Multi-language Support**: Turkish and English language support
- **Rich Demo Data**: Pre-populated with realistic restaurant data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma + SQLite (easily migrated to PostgreSQL)
- **QR Generation**: qrcode library
- **Icons**: Lucide React
- **Animations**: Framer Motion + CSS transitions

## Project Structure

```
QR-MENU/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── menu/           # Menu editor
│   │   ├── settings/       # Restaurant settings
│   │   └── page.tsx        # Dashboard
│   ├── api/                # API routes
│   │   ├── categories/     # Category CRUD
│   │   ├── items/          # Item CRUD
│   │   └── restaurant/     # Restaurant settings
│   ├── menu/
│   │   └── [slug]/         # Public menu view
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Reusable UI components
│   └── Footer.tsx
├── lib/
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data script
└── public/
```

## Installation & Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Step-by-Step Instructions

1. **Install Dependencies**

```bash
npm install
```

2. **Set Up Environment Variables**

The `.env` file is already created with default values:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Initialize Database**

Generate Prisma client and create the database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Seed the Database**

Populate the database with demo data:

```bash
npm run prisma:seed
```

This will create:
- 1 demo restaurant ("Demo Bistro & Cafe")
- 12 categories (Breakfasts, Snacks, Tacos, Pizzas, Grills, Seafood, Desserts, Lemonades, Non-alcoholic Drinks, Hot Drinks, Cocktails, Alcoholic Drinks)
- 60+ menu items with rich descriptions, prices, images, and allergen information
- Opening hours for all days of the week

5. **Run the Development Server**

```bash
npm run dev
```

6. **Open Your Browser**

- Landing Page: http://localhost:3000
- Public Menu: http://localhost:3000/menu/demo-bistro
- Admin Dashboard: http://localhost:3000/admin
- Menu Editor: http://localhost:3000/admin/menu
- Settings: http://localhost:3000/admin/settings

## Key Pages & Features

### Landing Page (`/`)

- Hero section with CTA buttons
- Feature cards highlighting key benefits
- Image library showcase
- Pricing tiers
- FAQ section with accordions
- Footer with links

### Public Menu View (`/menu/demo-bistro`)

- Restaurant header with logo and opening hours
- Language toggle (TR/EN)
- Restaurant info cards (address, phone, Instagram, WiFi)
- Sticky category navigation
- Category sections with menu items
- Item cards with:
  - Name and description (multi-language)
  - Price formatting
  - Badges (Popular, New, Spicy, Vegan)
  - Allergen information
  - Optional images
- Fully responsive design

### Admin Dashboard (`/admin`)

- Quick statistics (categories, items, active items)
- QR code preview with download
- Quick action buttons
- Categories overview

### Menu Editor (`/admin/menu`)

- Category sidebar with visibility toggles
- Item list with full details
- Toggle item visibility
- Edit and delete items
- Badges display (Popular, New, Spicy, Vegan)

### Restaurant Settings (`/admin/settings`)

- Basic info editor (name, slug, description)
- Contact information (phone, address, Instagram)
- WiFi credentials
- Theme color customization (primary, secondary, accent)
- QR code generation and download

## Customization

### Changing Demo Data

Edit the seed script at `prisma/seed.ts` to modify:
- Restaurant information
- Categories and their properties
- Menu items and descriptions
- Prices and currencies
- Images (update imageUrl fields)

After editing, re-run the seed:

```bash
npm run prisma:seed
```

### Changing Theme Colors

Two ways to customize colors:

1. **Via Admin Panel**: Go to `/admin/settings` and use the color pickers
2. **Via Database**: Update the `primaryColor`, `secondaryColor`, and `accentColor` fields in the `restaurants` table

### Changing Main Brand Colors

Edit `tailwind.config.ts` to modify the primary color palette used throughout the site.

## Database Management

### View Database in Prisma Studio

```bash
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 to view and edit data.

### Reset Database

To completely reset and reseed:

```bash
rm prisma/dev.db
npx prisma migrate dev --name init
npm run prisma:seed
```

### Migrate to PostgreSQL

1. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/qrmenu"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Run migrations:
```bash
npx prisma migrate dev
npm run prisma:seed
```

## API Endpoints

### Categories

- `GET /api/categories?restaurantId=1` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Items

- `GET /api/items?categoryId=1` - Get items by category
- `POST /api/items` - Create item
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item

### Restaurant

- `GET /api/restaurant/[id]` - Get restaurant details
- `PUT /api/restaurant/[id]` - Update restaurant

## Next Steps & Improvements

Here are potential features to add:

1. **User Authentication**: Add multi-tenant support with auth (NextAuth.js, Clerk, or Supabase Auth)
2. **Image Upload**: Integrate cloud storage (Cloudinary, AWS S3, or Vercel Blob) for menu item images
3. **Analytics Dashboard**: Track menu views, popular items, and customer engagement
4. **Order Integration**: Add cart functionality and integrate with POS systems
5. **Advanced Filtering**: Search, dietary filters (gluten-free, vegetarian), and price ranges
6. **Multi-restaurant Support**: Allow users to manage multiple restaurant menus
7. **Custom Themes**: Template selection with pre-designed color schemes
8. **Allergen Management**: Visual icons and better allergen display
9. **PDF Export**: Generate printable menu PDFs
10. **SEO Optimization**: Add meta tags, structured data, and sitemap generation
11. **PWA Support**: Make the menu installable as a Progressive Web App
12. **Social Sharing**: Share individual items or menu on social media

## Troubleshooting

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Database Locked Error

Close Prisma Studio or any other database connections and retry.

### Port 3000 Already in Use

```bash
npm run dev -- -p 3001
```

### Images Not Loading

Ensure image URLs in the seed data are accessible. The demo uses Pexels URLs which should work if you have internet connection.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please check:
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- Tailwind CSS docs: https://tailwindcss.com/docs
