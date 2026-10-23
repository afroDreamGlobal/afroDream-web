'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Loader2, AlertCircle, CheckCircle2, Clock, MapPin, Ship, Navigation } from 'lucide-react';
import { Shipment } from '@/lib/types';

export default function TrackingPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setShipment(null);

    try {
      const res = await fetch(`/api/tracking?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Shipment not found');
      }

      setShipment(data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error locating shipment';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'arrived_pod':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <main className="flex-grow py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-blue block mb-2 font-sans">
              CARGO VISIBILITY
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading uppercase text-brand-dark leading-tight">
              TRACK YOUR SHIPMENT
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-600 font-light">
              Enter your Afro Dream Global Tracking Number (e.g.{' '}
              <button
                type="button"
                onClick={() => {
                  setQuery('ADG7892401');
                }}
                className="text-brand-blue font-semibold underline underline-offset-2"
              >
                ADG7892401
              </button>
              ) or Booking Reference to view real-time voyage status and terminal discharge updates.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-card border border-brand-border p-4 sm:p-6 mb-10">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Tracking Number (e.g. ADG7892401, BK-2026-1044)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-brand-border text-sm font-medium uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="btn-primary py-3.5 px-8 rounded-xl font-semibold flex items-center justify-center space-x-2 flex-shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <span>Track Cargo</span>
                )}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 mb-8 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Shipment Not Located</h4>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Shipment Result Details */}
          {shipment && (
            <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden animate-fadeIn">
              {/* Top Banner Status */}
              <div className="bg-brand-dark text-white p-6 sm:p-8 border-b border-brand-dark-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider block">
                      Tracking Number
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-heading uppercase text-white tracking-wider">
                      {shipment.trackingNumber}
                    </h2>
                    <span className="text-xs text-gray-400">
                      Booking Ref: {shipment.bookingReference}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${getStatusBadgeClass(
                        shipment.status
                      )}`}
                    >
                      {shipment.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Vessel & Voyage Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-gray-400 block">Vessel Name</span>
                    <span className="text-white font-semibold mt-0.5 block">
                      {shipment.vesselName || 'Pending Allocation'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Voyage Number</span>
                    <span className="text-white font-semibold mt-0.5 block">
                      {shipment.voyageNumber || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Origin Port</span>
                    <span className="text-white font-semibold mt-0.5 block">{shipment.origin}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Destination Port</span>
                    <span className="text-white font-semibold mt-0.5 block">
                      {shipment.destination}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Timeline */}
              <div className="p-6 sm:p-8">
                <h3 className="font-heading text-xl uppercase text-brand-dark mb-6">
                  Shipment Milestones & Transit Events
                </h3>

                <div className="relative pl-6 sm:pl-8 border-l-2 border-brand-blue/30 space-y-8">
                  {shipment.events.map((event, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Marker */}
                      <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-5 h-5 rounded-full bg-brand-blue border-4 border-white shadow-sm flex items-center justify-center" />

                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="text-sm font-bold text-brand-dark">{event.statusLabel}</h4>
                          <span className="text-xs text-brand-muted">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs text-brand-blue font-medium mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
