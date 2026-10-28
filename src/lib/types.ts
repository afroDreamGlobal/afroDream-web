export type ServiceStatus = 'published' | 'draft';

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  iconName: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
  features: string[];
  routeHighlight?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type QuoteStatus = 'new' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'closed';

export interface QuoteRequest {
  id: string;
  referenceNumber: string;
  customerName: string;
  companyName?: string;
  email: string;
  phone: string;
  originCountry: string;
  originPort: string;
  destinationCountry: string;
  destinationPort: string;
  serviceType: string;
  paymentTerms?: string;
  advancePercentage?: string;
  finalPercentage?: string;
  cargoDescription: string;
  cargoWeight?: string;
  cargoVolume?: string;
  preferredDate?: string;
  additionalNotes?: string;
  status: QuoteStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TradeRoute {
  id: string;
  name: string;
  originRegion: string;
  originCountry: string;
  originPort: string;
  destinationRegion: string;
  destinationCountry: string;
  destinationPort: string;
  transitTime: string;
  frequency: string;
  cargoTypes: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export type ShipmentStatus = 
  | 'registered'
  | 'processing'
  | 'in_transit'
  | 'arrived_pod'
  | 'customs_clearance'
  | 'delivered';

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  statusLabel: string;
  location: string;
  description: string;
  timestamp: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  bookingReference: string;
  customerName: string;
  origin: string;
  destination: string;
  serviceType: string;
  cargoDescription: string;
  status: ShipmentStatus;
  vesselName?: string;
  voyageNumber?: string;
  estimatedDeparture?: string;
  estimatedArrival?: string;
  events: TrackingEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  announcementBarText: string;
  announcementBarEnabled: boolean;
  phoneGuineaBissau: string;
  phoneTanzania: string;
  phoneIndia: string;
  primaryEmail: string;
  quotesEmail: string;
  addressGuineaBissau: string;
  addressTanzania: string;
  addressIndia: string;
  whatsappNumber: string;
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  heroBadge?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroBannerImageUrl?: string;
  heroMobileBannerImageUrl?: string;
  showHeroTextOverlay?: boolean;
  showHeroCtaButtons?: boolean;
  aboutHeadline: string;
  aboutDescription: string;
  aboutImageUrl?: string;
  addressTanzaniaOffice?: string;
}

export type TeamDivision = 'Executive Leadership' | 'Tanzanian Operation Team' | string;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division?: string;
  department?: string;
  bio?: string;
  imageUrl: string;
  displayOrder: number;
  isPublished: boolean;
  email?: string;
  phone?: string;
  whatsapp?: string;
  linkedinUrl?: string;
  quote?: string;
  createdAt?: string;
  updatedAt?: string;
}
