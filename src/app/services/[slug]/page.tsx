import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';
import { store } from '@/lib/store';
import { getLiveServiceBySlug, getLivePublishedServices } from '@/lib/services';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { SiteSettings } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

async function getLiveSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('site_settings')
        .select('settings_data')
        .eq('id', 'primary')
        .maybeSingle();

      if (data?.settings_data) {
        return { ...store.getSettings(), ...data.settings_data };
      }
    } catch (e) {
      console.warn('[Supabase Settings Fetch]', e);
    }
  }
  return store.getSettings();
}

export async function generateStaticParams() {
  const services = await getLivePublishedServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const service = await getLiveServiceBySlug(params.slug);

  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested shipping and logistics service could not be found.',
    };
  }

  const title = `${service.title} | Afro Dream Global`;
  const description =
    service.shortDescription?.trim() ||
    `Specialized ${service.title.toLowerCase()} solutions connecting African ports in Tanzania and Guinea-Bissau with India, Vietnam, and global markets.`;
  const canonicalUrl = `/services/${service.slug}`;
  const ogImage = service.imageUrl || '/images/logo.png';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: ogImage,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = await getLiveServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const allServices = await getLivePublishedServices();
  const relatedServices = allServices.filter((s) => s.id !== service.id).slice(0, 3);
  const settings = await getLiveSettings();

  // JSON-LD Structured Data for Service & Breadcrumbs
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDescription || service.fullDescription,
    provider: {
      '@type': 'Organization',
      name: 'Afro Dream Global',
      url: 'https://www.afrodream.in',
    },
    serviceType: service.category || 'Shipping & Freight Forwarding',
    areaServed: ['Tanzania', 'Guinea-Bissau', 'India', 'Vietnam'],
    url: `https://www.afrodream.in/services/${service.slug}`,
    ...(service.imageUrl ? { image: service.imageUrl } : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.afrodream.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.afrodream.in/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://www.afrodream.in/services/${service.slug}`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={settings.phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-grow">
        {/* Breadcrumb & Header */}
        <section className="bg-brand-dark text-white py-14 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-brand-dark/80" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-brand-blue hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Services</span>
            </Link>

            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 block mb-2 font-sans">
              {service.category}
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading uppercase text-white leading-tight max-w-3xl">
              {service.title}
            </h1>
            {service.routeHighlight && (
              <p className="mt-4 text-sm sm:text-base text-gray-300 font-medium">
                Route Coverage: {service.routeHighlight}
              </p>
            )}
          </div>
        </section>

        {/* Content Body */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Details & Features */}
              <div className="lg:col-span-7 space-y-10">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-heading uppercase text-brand-dark">
                    Overview & Operational Scope
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed font-light">
                    {service.fullDescription}
                  </p>
                </div>

                {/* Key Capabilities */}
                <div className="space-y-4 pt-4 border-t border-brand-border">
                  <h3 className="text-xl font-heading uppercase text-brand-dark">
                    Key Operational Capabilities
                  </h3>
                  <div className="space-y-3">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl bg-brand-bg border border-brand-border/60">
                        <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-800 font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Services */}
                <div className="space-y-4 pt-6 border-t border-brand-border">
                  <h3 className="text-xl font-heading uppercase text-brand-dark">
                    Complementary Logistics Solutions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedServices.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/services/${rel.slug}`}
                        className="group p-4 rounded-xl border border-brand-border hover:border-brand-blue/50 bg-white hover:bg-brand-bg transition-all"
                      >
                        <h4 className="text-sm font-bold text-brand-dark group-hover:text-brand-blue transition-colors leading-snug">
                          {rel.title}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue mt-2">
                          <span>Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Pre-configured Quote Form */}
              <div className="lg:col-span-5 sticky top-28">
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                    Direct Booking Enquiry
                  </span>
                  <h3 className="text-2xl font-heading uppercase text-brand-dark">
                    Request a Quote for {service.title}
                  </h3>
                </div>
                <QuoteForm defaultService={service.title} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
