import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Cargo & Container Shipments | Afro Dream Global',
  description:
    'Track your consignment status and cargo movements in real-time with Afro Dream Global. Enter your B/L number or container ID for live maritime logistics updates.',
  alternates: {
    canonical: '/tracking',
  },
  openGraph: {
    title: 'Track Cargo & Container Shipments | Afro Dream Global',
    description:
      'Track your consignment status and cargo movements in real-time with Afro Dream Global. Enter your B/L number or container ID for live updates.',
    url: '/tracking',
    type: 'website',
  },
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

