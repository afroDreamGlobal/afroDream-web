# Afro Dream Global — Premium Corporate Website & Logistics Platform

A modern, responsive corporate website and dynamic management platform for **Afro Dream Global** — an international shipping, freight forwarding, cargo handling, and logistics company operating across East Africa (Mtwara Port, Tanzania), West Africa (CAJU SWIFT SARL / CSS in Guinea-Bissau), and strategic discharge terminals in India and Vietnam.

---

## 🎨 Visual Identity & Typography

- **Official Colors**:
  - Primary Blue: `#2B7CC0`
  - Primary Dark: `#231F20`
  - Supporting: `#FFFFFF`, `#F5F7FA`, `#667085`, `#E4E7EC`
- **Typography**:
  - **Bebas Neue** (`Bebas Neue Regular`) for high-impact display headlines (Hero, "GIVE A LOOK TO OUR SERVICES", Section Titles).
  - **Poppins** (Regular, Medium, SemiBold, Bold) for corporate body, badges, navigation, and structured data.
- **Logo**:
  - Official vector logo representation preserving the winged globe motif, horizontal speed tiers, and centered brand plaque in brand blue and white.

---

## 🚀 Key Features & Architecture

### 1. Public Portal
- **Header & Navigation**: Responsive sticky navigation with live status announcement bar, telephone & email quick links, mobile hamburger drawer, and "Get a Quote" call-to-action.
- **Hero Section**: Reproduces Reference Image 2 with container vessel background, high-contrast typography, and quick quote triggers.
- **Service Highlights Bar**: The 5-service quick icon bar immediately beneath the hero.
- **About Section**: Detailed corporate introduction highlighting **CAJU SWIFT SARL / CSS** in Guinea-Bissau (Est. 2022) and specialization in Raw Cashew Nut (RCN) containerized shipment.
- **Services Showcase**: 5 image cards grid on the homepage linking to dynamic service specifications.
- **Services Page (`/services`)**: Faithfully reproduces Reference Image 1 with the top golden-hour truck banner, **"GIVE A LOOK TO OUR SERVICES"** headline, dark navy background, and vertical divider/timeline layout.
- **Trade Routes Section (`/trade-routes`)**: Interactive trade route visualizer with region tabs (`INDIA`, `VIETNAM`, `GLOBAL`), destination port specs (Tuticorin, Mangalore, Visakhapatnam, Mundra), and animated transit corridors.
- **Shipment Tracking (`/tracking`)**: Customer-facing tracking interface supporting tracking numbers (e.g. `ADG7892401`, `ADG6541198`) with verified milestone timeline events.
- **Quote Request (`/quote`)**: Comprehensive quotation request workflow with React Hook Form, Zod validation, reference generation, and database persistence.
- **Corporate Contact (`/contact`)**: Regional hubs in Tanzania, Guinea-Bissau, and India.
- **Floating WhatsApp Connect**: Direct chat trigger as shown in mobile design.

### 2. Admin Management Dashboard (`/admin`)
- **Login (`/admin/login`)**: Secure administrator credentials check with session tokens.
- **Overview**: Real-time metrics calculated from actual database records (Total Enquiries, In-Review, Active Services, Monitored Corridors).
- **Service Management (`/admin/services`)**: Create, edit, publish/unpublish, reorder, and upload service imagery using Cloudinary.
- **Quote Enquiries (`/admin/quotes`)**: Filter by status (`New`, `Reviewing`, `Quoted`, `Accepted`, `Closed`), inspect full cargo specifications, and append internal administrative notes.
- **Trade Routes (`/admin/routes`)**: Configure origin and destination ports, transit times, and active statuses.
- **Shipment Milestones (`/admin/tracking`)**: Register new shipments and append live transit events with locations and timestamps.
- **Site Settings (`/admin/settings`)**: Edit hero copy, announcement bar, phone numbers, and emails without code modifications.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict type checking)
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **Icons**: Lucide React
- **Validation**: React Hook Form & Zod
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) policies
- **Media**: Cloudinary integration for signed/server-side image delivery
- **Transactional Email**: Brevo (Sendinblue) API for automated quote receipts

---

## 📁 Project Structure

```
afroDreamGlobal/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with Bebas Neue & Poppins fonts
│   │   ├── page.tsx                   # Homepage matching Reference Image 2
│   │   ├── globals.css                # Design tokens & typography utilities
│   │   ├── about/page.tsx             # Corporate About Us page
│   │   ├── services/page.tsx          # Services timeline matching Reference Image 1
│   │   ├── services/[slug]/page.tsx   # Dynamic service detail specifications
│   │   ├── trade-routes/page.tsx      # Port corridors and sailing schedules
│   │   ├── tracking/page.tsx          # Customer shipment tracking portal
│   │   ├── quote/page.tsx             # Freight quotation request form
│   │   ├── contact/page.tsx           # Regional offices and contact directory
│   │   ├── admin/                     # Secure Admin Management Dashboard
│   │   │   ├── layout.tsx             # Admin sidebar layout
│   │   │   ├── page.tsx               # Operational overview & live metrics
│   │   │   ├── login/page.tsx         # Admin login authentication
│   │   │   ├── services/page.tsx      # Services CRUD & Cloudinary uploads
│   │   │   ├── quotes/page.tsx        # Quote inquiries management & notes
│   │   │   ├── routes/page.tsx        # Trade route management
│   │   │   ├── tracking/page.tsx      # Shipment tracking events manager
│   │   │   └── settings/page.tsx      # Site copy & contacts editor
│   │   └── api/                       # Next.js Route Handlers (quotes, tracking, admin)
│   ├── components/                    # Reusable React components
│   │   ├── AfroDreamLogo.tsx          # Official vector brand logo
│   │   ├── Navbar.tsx                 # Sticky navigation with mobile drawer
│   │   ├── Footer.tsx                 # Corporate footer & WhatsApp trigger
│   │   ├── HeroSection.tsx            # Logistics hero section
│   │   ├── ServiceHighlightsBar.tsx   # 5-service icons strip beneath hero
│   │   ├── AboutSection.tsx           # Editorial About section
│   │   ├── ServicesSection.tsx        # 5 service image cards showcase
│   │   ├── TradeRoutesSection.tsx     # Trade route map visualizer & port tabs
│   │   ├── QuoteForm.tsx              # Validated quotation inquiry form
│   │   └── AdminSidebar.tsx           # Admin portal navigation sidebar
│   └── lib/
│       ├── types.ts                   # Domain models and TypeScript interfaces
│       ├── store.ts                   # In-memory and persistent data store
│       ├── supabase.ts                # Supabase client initialization
│       ├── cloudinary.ts              # Cloudinary media transformation helpers
│       └── brevo.ts                   # Transactional email service
├── supabase/
│   └── schema.sql                     # Production PostgreSQL schema & RLS policies
├── .env.example                       # Environment configuration template
└── package.json
```

---

## ⚙️ Setup and Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your credentials:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to view the public website and `http://localhost:3000/admin` to access the administrator platform.

**Default Administrator Credentials**:
- **Email**: `admin@afrodreamglobal.com`
- **Password**: `admin123`

### 4. Build for Production
```bash
npm run build
npm run start
```
