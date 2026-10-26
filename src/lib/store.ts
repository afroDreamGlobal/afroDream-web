import { Service, QuoteRequest, TradeRoute, Shipment, SiteSettings, TeamMember } from './types';

// Default initial services from the client's reference images
export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    slug: 'container-shipment',
    title: 'Container Shipment',
    shortDescription:
      'We are Providing Best rate and administration supports in container shipments from Mtwara port especially for Raw Cashew Nut Traders and Buyers.',
    fullDescription:
      'Specialized international containerized shipping solutions connecting East and West Africa to global ports. We provide competitive freight rates, dedicated container leasing, seamless booking management, and comprehensive documentation support. Specially optimized for Raw Cashew Nut (RCN) traders, exporters, and international commodity buyers.',
    imageUrl:
      'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792748916/afrodreamglobal/zwwvgmhgiptpmp2cbxe2.png',
    iconName: 'Container',
    category: 'Ocean Freight',
    displayOrder: 1,
    isPublished: true,
    features: [
      'Origin port operations at Mtwara & Bissau',
      'Specialized Raw Cashew Nut (RCN) container stuffing',
      'Direct carrier contracts for competitive ocean freight',
      'Moisture control and quality inspection support',
      'Full bill of lading and export document processing',
    ],
    routeHighlight: 'Mtwara / Bissau to Global Hubs',
  },
  {
    id: 'srv-2',
    slug: 'bulk-vessel-shipment',
    title: 'Bulk Vessel Shipment',
    shortDescription:
      'One of our attractive part in the shipment of Tanzania is Bulk Vessel shipment. Join and feel the difference.',
    fullDescription:
      'High-capacity breakbulk and dry bulk vessel chartering services for large commodity volumes. We manage vessel loading, berthing priority, stevedoring supervision, hatch inspection, and comprehensive maritime documentation across African deep-water terminals.',
    imageUrl:
      'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792749312/afrodreamglobal/ryjyhl2ir2of6omoucki.png',
    iconName: 'Ship',
    category: 'Maritime Cargo',
    displayOrder: 2,
    isPublished: true,
    features: [
      'Full and part vessel charter arrangements',
      'Port captaincy and stevedore supervision',
      'Fast turnaround time at origin loading berths',
      'Bulk agricultural commodities handling expertise',
      'Real-time vessel position updates and laytime calculations',
    ],
    routeHighlight: 'Tanzania & West Africa Deep-water Ports',
  },
  {
    id: 'srv-3',
    slug: 'local-transportation-tanzania',
    title: 'Local Transportation in Tanzania',
    shortDescription:
      'we are handling the local transportation from different warehouses in all regions of southern Tanzania.',
    fullDescription:
      'Reliable inland haulage and trucking networks covering southern and coastal Tanzania. We connect inland farms, collection centers, and primary warehouses directly to port storage facilities and ocean terminals, ensuring safety and zero transit delay for sensitive agricultural cargo.',
    imageUrl:
      'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792749462/afrodreamglobal/ht4kfr9ducofhynwik1r.png',
    iconName: 'Truck',
    category: 'Inland Logistics',
    displayOrder: 3,
    isPublished: true,
    features: [
      'Extensive fleet of heavy-duty flatbed and box trucks',
      'Southern Tanzania warehouse-to-port direct corridors',
      'GPS monitored transit and security escorts where required',
      'Weighbridge inspection and tally verification',
      'Flexible dispatch for peak seasonal harvesting volumes',
    ],
    routeHighlight: 'Southern Tanzania to Mtwara Port',
  },
  {
    id: 'srv-4',
    slug: 'clearing-port-of-destination',
    title: 'Clearing in the Port of Destination (POD)',
    shortDescription:
      'We clearing your cargo in the destination port like Mangalore, Tuticorin, Ho Chi Minh etc...',
    fullDescription:
      'Professional customs brokerage and import clearance services at strategic destination ports across India and Southeast Asia. We navigate customs regulations, phytosanitary requirements, duty assessments, and port authority procedures for rapid cargo release.',
    imageUrl:
      'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792749708/afrodreamglobal/vzcdhjiufjl1qhbrnitn.png',
    iconName: 'Anchor',
    category: 'Customs & Port Services',
    displayOrder: 4,
    isPublished: true,
    features: [
      'Active customs clearance at Tuticorin, Mangalore, Mundra, and Visakhapatnam',
      'Southeast Asia port operations including Ho Chi Minh, Vietnam',
      'Plant quarantine and phytosanitary inspection management',
      'Rapid delivery order (DO) and port fee settlement',
      'Transparent documentation with zero hidden port demurrage',
    ],
    routeHighlight: 'Tuticorin, Mangalore, Mundra, Ho Chi Minh',
  },
  {
    id: 'srv-5',
    slug: 'local-transportation-india',
    title: 'Local Transportation in India',
    shortDescription:
      'We can take your materials from your warehouse door in African Continental to the Indian Warehouse door of yours.',
    fullDescription:
      'True end-to-end multimodal logistics. From the moment your cargo is cleared at Indian ports (Tuticorin, Mangalore, Mundra, etc.), our bonded and commercial transport fleet delivers containers directly to your processing mills and warehouse doors across India.',
    imageUrl:
      'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792749867/afrodreamglobal/oxp9jcv4xlrye12eswfs.png',
    iconName: 'Truck',
    category: 'Door-to-Door Delivery',
    displayOrder: 5,
    isPublished: true,
    features: [
      'Door-to-door multimodal freight from Africa to India',
      'Direct connectivity from port gate to factory/warehouse',
      'Container de-stuffing and palletized distribution options',
      'Real-time transport tracking and electronic proof of delivery (e-POD)',
      'Dedicated handling for cashew processing units and agro-mills',
    ],
    routeHighlight: 'Indian Coastal Ports to Inland Processing Hubs',
  },
];

export const INITIAL_TRADE_ROUTES: TradeRoute[] = [
  {
    id: 'tr-1',
    name: 'Tanzania to South India (Tuticorin & Mangalore)',
    originRegion: 'East Africa',
    originCountry: 'Tanzania',
    originPort: 'Mtwara Port',
    destinationRegion: 'South Asia',
    destinationCountry: 'India',
    destinationPort: 'Tuticorin / Mangalore',
    transitTime: '14 - 18 Days',
    frequency: 'Weekly departures during season',
    cargoTypes: ['Raw Cashew Nuts', 'Agricultural Commodities', 'Dry Bulk'],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'tr-2',
    name: 'Tanzania to Vietnam',
    originRegion: 'East Africa',
    originCountry: 'Tanzania',
    originPort: 'Mtwara Port',
    destinationRegion: 'Southeast Asia',
    destinationCountry: 'Vietnam',
    destinationPort: 'Ho Chi Minh City (HCMC) / Cat Lai (Cát Lái)',
    transitTime: '18 - 22 Days',
    frequency: 'Weekly scheduled sailings',
    cargoTypes: ['Raw Cashew Nuts', 'Agricultural Commodities', 'Dry Bulk'],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'tr-3',
    name: 'West Africa to India & Vietnam Corridor',
    originRegion: 'West Africa',
    originCountry: 'Guinea-Bissau',
    originPort: 'Bissau Port',
    destinationRegion: 'Asia',
    destinationCountry: 'India / Vietnam',
    destinationPort: 'Tuticorin / Ho Chi Minh',
    transitTime: '24 - 30 Days',
    frequency: 'Regular seasonal container service',
    cargoTypes: ['Raw Cashew Nuts', 'Commercial Freight'],
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'tr-4',
    name: 'East Africa to Southeast Asia (Vietnam)',
    originRegion: 'East Africa',
    originCountry: 'Tanzania',
    originPort: 'Mtwara / Dar es Salaam',
    destinationRegion: 'Southeast Asia',
    destinationCountry: 'Vietnam',
    destinationPort: 'Ho Chi Minh Port',
    transitTime: '18 - 22 Days',
    frequency: 'Weekly departures',
    cargoTypes: ['Raw Cashew Nuts', 'Agricultural Cargo'],
    isActive: true,
    isFeatured: true,
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'Afro Dream Global',
  tagline: 'Reliable Shipping Solutions Connecting Africa to Global Markets',
  announcementBarText:
    'Reliable container & bulk vessel shipping active from Mtwara Port & West Africa. Inquire for seasonal freight rates.',
  announcementBarEnabled: true,
  phoneGuineaBissau: '+245 955 888 123',
  phoneTanzania: '+255 744 555 890',
  phoneIndia: '+91 98401 23456',
  primaryEmail: 'info@afrodreamglobal.com',
  quotesEmail: 'quotes@afrodreamglobal.com',
  addressGuineaBissau: 'CAJU SWIFT SARL / CSS, Port Area, Bissau, Guinea-Bissau',
  addressTanzania: 'Mtwara Port Logistics Corridor, Mtwara, Tanzania',
  addressIndia: 'Port Logistics Wing, Tuticorin & Mangalore, India',
  whatsappNumber: '+255744555890',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/afrodreamglobal',
    facebook: 'https://facebook.com/afrodreamglobal',
  },
  heroBadge: 'RELIABLE SHIPPING SOLUTIONS',
  heroHeadline: 'CONNECTING AFRICA TO GLOBAL MARKETS',
  heroSubheadline:
    'Comprehensive logistics and shipping solutions for Raw Cashew Nuts and global cargo. Reliable, efficient, and professional services across Africa and beyond.',
  heroBannerImageUrl:
    'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792683054/afrodreamglobal/qz5w6pmekttac4vuewhd.png',
  heroMobileBannerImageUrl:
    'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792683431/afrodreamglobal/bol41kvfxowfudwqdsda.png',
  showHeroTextOverlay: true,
  showHeroCtaButtons: true,
  aboutHeadline: 'ABOUT AFRO DREAM GLOBAL',
  aboutDescription:
    'AFRO DREAM GLOBAL (CAJU SWIFT SARL / CSS in Guinea-Bissau) is a logistics and shipping service provider based in West Africa. Since 2022, we have specialized in the containerized shipment of raw cashew nuts, establishing ourselves as a reliable partner in the shipping and logistics industry.',
  aboutImageUrl:
    'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792682872/afrodreamglobal/afgudguzik42xzhqveoo.png',
};

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'q-101',
    referenceNumber: 'ADG-Q-2026-001',
    customerName: 'Kishore Agro Traders',
    companyName: 'Kishore Commodities LLP',
    email: 'operations@kishoreagro.in',
    phone: '+91 98405 67890',
    originCountry: 'Tanzania',
    originPort: 'Mtwara Port',
    destinationCountry: 'India',
    destinationPort: 'Tuticorin',
    serviceType: 'Container Shipment',
    paymentTerms: 'Prepaid',
    cargoDescription: '500 MT Raw Cashew Nuts (In Shell)',
    cargoWeight: '500 MT',
    cargoVolume: '25 x 40ft High Cube Containers',
    preferredDate: '2026-11-15',
    additionalNotes: 'Need phytosanitary assistance and pre-cooling container inspection.',
    status: 'reviewing',
    internalNotes: 'Contacted carrier for special slot allotment on direct vessel.',
    createdAt: '2026-10-21T09:30:00Z',
  },
  {
    id: 'q-102',
    referenceNumber: 'ADG-Q-2026-002',
    customerName: 'Nguyen Van Minh',
    companyName: 'Saigon Agro Imports Co.',
    email: 'minh.nguyen@saigoncashew.vn',
    phone: '+84 903 123 456',
    originCountry: 'Guinea-Bissau',
    originPort: 'Bissau Port',
    destinationCountry: 'Vietnam',
    destinationPort: 'Ho Chi Minh',
    serviceType: 'Container Shipment',
    paymentTerms: 'Collect',
    cargoDescription: '300 MT High Grade Raw Cashew Nuts',
    cargoWeight: '300 MT',
    cargoVolume: '15 x 40ft Containers',
    preferredDate: '2026-11-20',
    additionalNotes: 'Require clearing at POD and barge transfer support.',
    status: 'new',
    createdAt: '2026-10-22T04:15:00Z',
  },
  {
    id: 'q-103',
    referenceNumber: 'ADG-Q-2026-003',
    customerName: 'Deepak Exports',
    companyName: 'Deepak Global Logistics',
    email: 'deepak@deepakglobal.com',
    phone: '+91 94432 11223',
    originCountry: 'Tanzania',
    originPort: 'Mtwara Port',
    destinationCountry: 'India',
    destinationPort: 'Mangalore',
    serviceType: 'Local Transportation in India',
    paymentTerms: 'Advance 50% / Final 50%',
    advancePercentage: '50',
    finalPercentage: '50',
    cargoDescription: 'Port clearing and trucking to Udupi cashew processing unit.',
    cargoWeight: '120 MT',
    preferredDate: '2026-11-05',
    status: 'quoted',
    internalNotes: 'Quoted standard trucking tariffs with port handling included.',
    createdAt: '2026-10-20T14:00:00Z',
  },
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'shp-1',
    trackingNumber: 'ADG7892401',
    bookingReference: 'BK-2026-1044',
    customerName: 'Kishore Commodities LLP',
    origin: 'Mtwara Port, Tanzania',
    destination: 'Tuticorin Port, India',
    serviceType: 'Container Shipment',
    cargoDescription: 'Raw Cashew Nuts (25 x 40ft)',
    status: 'in_transit',
    vesselName: 'MV OCEAN BLUE EXPRESS',
    voyageNumber: 'OBE-2610E',
    estimatedDeparture: '2026-10-18',
    estimatedArrival: '2026-10-31',
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-10-20T16:00:00Z',
    events: [
      {
        id: 'ev-1',
        shipmentId: 'shp-1',
        status: 'registered',
        statusLabel: 'Shipment Registered',
        location: 'Mtwara Logistics Depot, Tanzania',
        description: 'Booking confirmed and empty containers released for stuffing.',
        timestamp: '2026-10-15T10:30:00Z',
      },
      {
        id: 'ev-2',
        shipmentId: 'shp-1',
        status: 'processing',
        statusLabel: 'Customs & Port Loading',
        location: 'Mtwara Ocean Terminal, Tanzania',
        description: 'Export customs cleared and loaded aboard MV OCEAN BLUE EXPRESS.',
        timestamp: '2026-10-17T18:45:00Z',
      },
      {
        id: 'ev-3',
        shipmentId: 'shp-1',
        status: 'in_transit',
        statusLabel: 'In Transit',
        location: 'Indian Ocean Corridor',
        description: 'Vessel en route to Tuticorin Port. On schedule.',
        timestamp: '2026-10-20T12:00:00Z',
      },
    ],
  },
  {
    id: 'shp-2',
    trackingNumber: 'ADG6541198',
    bookingReference: 'BK-2026-1022',
    customerName: 'Saigon Agro Imports Co.',
    origin: 'Bissau Port, Guinea-Bissau',
    destination: 'Ho Chi Minh Port, Vietnam',
    serviceType: 'Container Shipment',
    cargoDescription: 'Raw Cashew Nuts (15 Containers)',
    status: 'arrived_pod',
    vesselName: 'MV CASHEW TRADER',
    voyageNumber: 'CT-2609',
    estimatedDeparture: '2026-09-28',
    estimatedArrival: '2026-10-22',
    createdAt: '2026-09-25T08:00:00Z',
    updatedAt: '2026-10-22T06:30:00Z',
    events: [
      {
        id: 'ev-11',
        shipmentId: 'shp-2',
        status: 'registered',
        statusLabel: 'Shipment Registered',
        location: 'Bissau, Guinea-Bissau',
        description: 'Containers stuffed at export consolidation warehouse.',
        timestamp: '2026-09-25T09:00:00Z',
      },
      {
        id: 'ev-12',
        shipmentId: 'shp-2',
        status: 'in_transit',
        statusLabel: 'Maritime Transit',
        location: 'Cape Route -> Southeast Asia',
        description: 'Deep sea voyage proceeding smoothly.',
        timestamp: '2026-10-05T14:20:00Z',
      },
      {
        id: 'ev-13',
        shipmentId: 'shp-2',
        status: 'arrived_pod',
        statusLabel: 'Arrived at Destination Port',
        location: 'Ho Chi Minh Port, Vietnam',
        description: 'Vessel arrived at anchorage; discharging underway.',
        timestamp: '2026-10-22T06:15:00Z',
      },
    ],
  },
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [];

// Global in-memory / persistent storage singleton for production & dev
class DataStore {
  private services: Service[] = [...INITIAL_SERVICES];
  private tradeRoutes: TradeRoute[] = [...INITIAL_TRADE_ROUTES];
  private siteSettings: SiteSettings = { ...INITIAL_SETTINGS };
  private quotes: QuoteRequest[] = [...INITIAL_QUOTES];
  private shipments: Shipment[] = [...INITIAL_SHIPMENTS];
  private teamMembers: TeamMember[] = [...INITIAL_TEAM_MEMBERS];

  // SERVICES
  getServices(): Service[] {
    return [...this.services].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getPublishedServices(): Service[] {
    return this.getServices().filter((s) => s.isPublished);
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find((s) => s.slug === slug);
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find((s) => s.id === id);
  }

  saveService(serviceData: Partial<Service> & { title: string }): Service {
    if (serviceData.id) {
      const idx = this.services.findIndex((s) => s.id === serviceData.id);
      if (idx !== -1) {
        const updated = {
          ...this.services[idx],
          ...serviceData,
          updatedAt: new Date().toISOString(),
        } as Service;
        this.services[idx] = updated;
        return updated;
      }
    }

    const newService: Service = {
      id: serviceData.id || `srv-${Date.now()}`,
      slug:
        serviceData.slug ||
        serviceData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      title: serviceData.title,
      shortDescription: serviceData.shortDescription || '',
      fullDescription: serviceData.fullDescription || '',
      imageUrl:
        serviceData.imageUrl ||
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
      iconName: serviceData.iconName || 'Ship',
      category: serviceData.category || 'Shipping Service',
      displayOrder: serviceData.displayOrder ?? this.services.length + 1,
      isPublished: serviceData.isPublished ?? true,
      features: serviceData.features || [],
      routeHighlight: serviceData.routeHighlight || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.services.push(newService);
    return newService;
  }

  deleteService(id: string): boolean {
    const prevLen = this.services.length;
    this.services = this.services.filter((s) => s.id !== id);
    return this.services.length < prevLen;
  }

  // TRADE ROUTES
  getTradeRoutes(): TradeRoute[] {
    return [...this.tradeRoutes];
  }

  saveTradeRoute(routeData: Partial<TradeRoute> & { name: string }): TradeRoute {
    if (routeData.id) {
      const idx = this.tradeRoutes.findIndex((r) => r.id === routeData.id);
      if (idx !== -1) {
        const updated = { ...this.tradeRoutes[idx], ...routeData } as TradeRoute;
        this.tradeRoutes[idx] = updated;
        return updated;
      }
    }

    const newRoute: TradeRoute = {
      id: routeData.id || `tr-${Date.now()}`,
      name: routeData.name,
      originRegion: routeData.originRegion || 'Africa',
      originCountry: routeData.originCountry || 'Tanzania',
      originPort: routeData.originPort || 'Mtwara',
      destinationRegion: routeData.destinationRegion || 'Asia',
      destinationCountry: routeData.destinationCountry || 'India',
      destinationPort: routeData.destinationPort || 'Tuticorin',
      transitTime: routeData.transitTime || '14 - 18 Days',
      frequency: routeData.frequency || 'Weekly',
      cargoTypes: routeData.cargoTypes || ['Raw Cashew Nuts'],
      isActive: routeData.isActive ?? true,
      isFeatured: routeData.isFeatured ?? false,
    };
    this.tradeRoutes.push(newRoute);
    return newRoute;
  }

  deleteTradeRoute(id: string): boolean {
    const prevLen = this.tradeRoutes.length;
    this.tradeRoutes = this.tradeRoutes.filter((r) => r.id !== id);
    return this.tradeRoutes.length < prevLen;
  }

  // QUOTES
  getQuotes(): QuoteRequest[] {
    return [...this.quotes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getQuoteById(id: string): QuoteRequest | undefined {
    return this.quotes.find((q) => q.id === id);
  }

  createQuote(
    data: Omit<QuoteRequest, 'id' | 'referenceNumber' | 'createdAt' | 'status'>
  ): QuoteRequest {
    const referenceNumber = `ADG-Q-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const newQuote: QuoteRequest = {
      ...data,
      id: `q-${Date.now()}`,
      referenceNumber,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.quotes.unshift(newQuote);
    return newQuote;
  }

  updateQuoteStatus(
    id: string,
    status: QuoteRequest['status'],
    internalNotes?: string
  ): QuoteRequest | null {
    const quote = this.quotes.find((q) => q.id === id);
    if (!quote) return null;
    quote.status = status;
    if (internalNotes !== undefined) {
      quote.internalNotes = internalNotes;
    }
    quote.updatedAt = new Date().toISOString();
    return quote;
  }

  // SHIPMENT TRACKING
  lookupShipment(query: string): Shipment | null {
    const cleaned = query.trim().toUpperCase();
    return (
      this.shipments.find(
        (s) =>
          s.trackingNumber.toUpperCase() === cleaned ||
          s.bookingReference.toUpperCase() === cleaned
      ) || null
    );
  }

  getShipments(): Shipment[] {
    return [...this.shipments];
  }

  saveShipment(shipmentData: Partial<Shipment> & { trackingNumber: string }): Shipment {
    const idx = this.shipments.findIndex(
      (s) => s.trackingNumber.toUpperCase() === shipmentData.trackingNumber.toUpperCase()
    );
    if (idx !== -1) {
      const updated = {
        ...this.shipments[idx],
        ...shipmentData,
        updatedAt: new Date().toISOString(),
      } as Shipment;
      this.shipments[idx] = updated;
      return updated;
    }

    const newShp: Shipment = {
      id: shipmentData.id || `shp-${Date.now()}`,
      trackingNumber: shipmentData.trackingNumber.toUpperCase(),
      bookingReference: shipmentData.bookingReference || `BK-${Date.now()}`,
      customerName: shipmentData.customerName || 'Customer',
      origin: shipmentData.origin || 'Mtwara, Tanzania',
      destination: shipmentData.destination || 'Tuticorin, India',
      serviceType: shipmentData.serviceType || 'Container Shipment',
      cargoDescription: shipmentData.cargoDescription || 'Raw Cashew Nuts',
      status: shipmentData.status || 'registered',
      events: shipmentData.events || [
        {
          id: `ev-${Date.now()}`,
          shipmentId: shipmentData.id || `shp-${Date.now()}`,
          status: 'registered',
          statusLabel: 'Shipment Registered',
          location: shipmentData.origin || 'Mtwara',
          description: 'Shipment registered in system.',
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.shipments.unshift(newShp);
    return newShp;
  }

  // SETTINGS
  getSettings(): SiteSettings {
    return { ...this.siteSettings };
  }

  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.siteSettings = { ...this.siteSettings, ...settings };
    return { ...this.siteSettings };
  }

  // TEAM MEMBERS
  getTeamMembers(): TeamMember[] {
    return [...this.teamMembers].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getPublishedTeamMembers(): TeamMember[] {
    return this.getTeamMembers().filter((m) => m.isPublished);
  }

  getTeamMemberById(id: string): TeamMember | undefined {
    return this.teamMembers.find((m) => m.id === id);
  }

  saveTeamMember(data: Partial<TeamMember> & { name: string }): TeamMember {
    if (data.id) {
      const idx = this.teamMembers.findIndex((m) => m.id === data.id);
      if (idx !== -1) {
        const updated = {
          ...this.teamMembers[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        } as TeamMember;
        this.teamMembers[idx] = updated;
        return updated;
      }
    }

    const newMember: TeamMember = {
      id: data.id || `team-${Date.now()}`,
      name: data.name,
      role: data.role || 'Team Member',
      department: data.department || 'Operations',
      bio: data.bio || '',
      imageUrl: data.imageUrl || '/images/team/muhammed-shameem.jpg',
      displayOrder: data.displayOrder ?? this.teamMembers.length + 1,
      isPublished: data.isPublished ?? true,
      email: data.email || '',
      phone: data.phone || data.whatsapp || '',
      whatsapp: data.whatsapp || data.phone || '',
      linkedinUrl: data.linkedinUrl || '',
      quote: data.quote || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.teamMembers.push(newMember);
    return newMember;
  }

  deleteTeamMember(id: string): boolean {
    const initialLen = this.teamMembers.length;
    this.teamMembers = this.teamMembers.filter((m) => m.id !== id);
    return this.teamMembers.length < initialLen;
  }
}

// Global instance
declare global {
  // eslint-disable-next-line no-var
  var __afroDreamStore: DataStore | undefined;
}

export const store = global.__afroDreamStore || new DataStore();
if (process.env.NODE_ENV !== 'production') {
  global.__afroDreamStore = store;
}
