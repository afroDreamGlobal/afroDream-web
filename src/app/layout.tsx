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
  title: 'Afro Dream Global — Reliable Shipping Solutions Connecting Africa to Global Markets',
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
  ],
  authors: [{ name: 'Afro Dream Global' }],
  openGraph: {
    title: 'Afro Dream Global — Connecting Africa to Global Markets',
    description:
      'Premier containerized and bulk cargo logistics connecting East and West Africa to global ports in India, Vietnam, and beyond.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Afro Dream Global',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${poppins.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-white text-brand-dark antialiased">
        {children}
      </body>
    </html>
  );
}
