import type { Metadata } from 'next';
import { Bebas_Neue, Poppins } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  fallback: ['Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.afrodream.in'),
  title: {
    default: 'Afro Dream Global — Reliable Shipping Solutions Connecting Africa to Global Markets',
    template: '%s | Afro Dream Global',
  },
  description:
    'Afro Dream Global is a premier shipping and logistics partner specializing in Raw Cashew Nuts (RCN), container shipments, bulk vessels, and multimodal logistics across Tanzania, West Africa, India, and Vietnam.',
  keywords: [
    'Afro Dream Global',
    'African shipping',
    'Mtwara port shipping',
    'Raw Cashew Nuts shipping',
    'container shipment Africa',
    'bulk vessel shipment Tanzania',
    'freight forwarding India',
    'port clearing POD',
    'Guinea-Bissau shipping',
    'Tuticorin port logistics',
    'Vietnam cashew freight',
  ],
  authors: [{ name: 'Afro Dream Global' }],
  creator: 'Afro Dream Global',
  publisher: 'Afro Dream Global',
  alternates: {
    canonical: './',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/images/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png' },
      { url: '/images/logo.png' },
    ],
  },
  openGraph: {
    title: 'Afro Dream Global — Connecting Africa to Global Markets',
    description:
      'Premier containerized and bulk cargo logistics connecting East and West Africa to global ports in India, Vietnam, and beyond.',
    url: 'https://www.afrodream.in',
    type: 'website',
    locale: 'en_US',
    siteName: 'Afro Dream Global',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Afro Dream Global Logistics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Afro Dream Global — Connecting Africa to Global Markets',
    description:
      'Premier containerized and bulk cargo logistics connecting East and West Africa to global ports in India, Vietnam, and beyond.',
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Afro Dream Global',
    alternateName: 'CAJU SWIFT SARL',
    url: 'https://www.afrodream.in',
    logo: 'https://www.afrodream.in/images/logo.png',
    description:
      'Afro Dream Global is a premier shipping and logistics partner specializing in Raw Cashew Nuts (RCN), container shipments, bulk vessels, and multimodal logistics across Tanzania, West Africa, India, and Vietnam.',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+255 744 555 890',
        contactType: 'customer service',
        areaServed: 'TZ',
        availableLanguage: ['en', 'sw'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+245 955 888 123',
        contactType: 'operations',
        areaServed: 'GW',
        availableLanguage: ['en', 'pt', 'fr'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+91 98401 23456',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['en', 'ta', 'hi'],
      },
    ],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Mtwara Port Logistics Corridor',
        addressCountry: 'Tanzania',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Port Commercial Sector',
        addressLocality: 'Bissau',
        addressCountry: 'Guinea-Bissau',
      },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Afro Dream Global',
    url: 'https://www.afrodream.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.afrodream.in/tracking?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${bebasNeue.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-white text-brand-dark antialiased">
        {children}
      </body>
    </html>
  );
}
