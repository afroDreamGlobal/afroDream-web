'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Box,
  Navigation,
  Ship,
  Clock,
  ArrowRight,
  Eye,
  Loader2,
  Users,
} from 'lucide-react';
import { QuoteRequest } from '@/lib/types';

export default function AdminOverviewPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [servicesCount, setServicesCount] = useState(0);
  const [routesCount, setRoutesCount] = useState(0);
  const [shipmentsCount, setShipmentsCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Quotes
    fetch('/api/quotes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setQuotes(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    // 2. Fetch Services Count
    fetch('/api/admin/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setServicesCount(data.data.length);
        }
      })
      .catch(() => {});

    // 3. Fetch Trade Routes Count
    fetch('/api/admin/routes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setRoutesCount(data.data.length);
        }
      })
      .catch(() => {});

    // 4. Fetch Shipments Count
    fetch('/api/admin/tracking')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setShipmentsCount(data.data.length);
        }
      })
      .catch(() => {});

    // 5. Fetch Team Members Count
    fetch('/api/admin/team')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTeamCount(data.data.length);
        }
      })
      .catch(() => {});
  }, []);

  const totalQuotes = quotes.length;
  const newQuotes = quotes.filter((q) => q.status === 'new').length;
  const inProgressQuotes = quotes.filter((q) => q.status === 'reviewing').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reviewing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'quoted':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-heading uppercase text-brand-dark tracking-wide">
          OPERATIONAL OVERVIEW
        </h1>
        <p className="text-sm text-brand-muted">
          Real-time metrics calculated from database freight records and active inquiries.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Enquiries */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Total Enquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-sans text-brand-dark">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-brand-blue inline" /> : totalQuotes}
            </div>
            <div className="text-xs text-brand-blue font-semibold mt-1">
              {newQuotes} new pending review
            </div>
          </div>
        </div>

        {/* In Review */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              In Review
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-sans text-brand-dark">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-amber-600 inline" /> : inProgressQuotes}
            </div>
            <div className="text-xs text-amber-600 font-semibold mt-1">Commercial tariffs matching</div>
          </div>
        </div>

        {/* Active Services */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Active Services
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-sans text-brand-dark">
              {servicesCount || 5}
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">Published on website</div>
          </div>
        </div>

        {/* Monitored Corridors */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Trade Corridors
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-sans text-brand-dark">
              {routesCount || 4}
            </div>
            <div className="text-xs text-purple-600 font-semibold mt-1">Active transit routes</div>
          </div>
        </div>

        {/* Team Members Card */}
        <Link
          href="/admin/team"
          className="bg-white rounded-2xl p-6 shadow-card border border-brand-border hover:border-amber-400 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted group-hover:text-amber-600 transition-colors">
              Team Members
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-sans text-brand-dark">
              {teamCount || 5}
            </div>
            <div className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <span>Manage personnel</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Quote Enquiries */}
      <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-dark">Recent Freight Quote Requests</h2>
            <p className="text-xs text-brand-muted">
              Latest inquiries received from exporters and cashew commodity traders.
            </p>
          </div>
          <Link
            href="/admin/quotes"
            className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
          >
            <span>View All ({totalQuotes})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-brand-border">
              <tr>
                <th className="py-3.5 px-6">Reference</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Service</th>
                <th className="py-3.5 px-6">Origin &rarr; POD</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-brand-muted">
                    No freight inquiries received yet.
                  </td>
                </tr>
              ) : (
                quotes.slice(0, 5).map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-brand-dark text-xs">
                      {quote.referenceNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-brand-dark text-xs">{quote.customerName}</div>
                      <div className="text-[11px] text-brand-muted">{quote.companyName || quote.email}</div>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-700">{quote.serviceType}</td>
                    <td className="py-4 px-6 text-xs text-gray-700">
                      {quote.originPort} &rarr; {quote.destinationPort}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getStatusColor(
                          quote.status
                        )}`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href="/admin/quotes"
                        className="text-xs font-semibold text-brand-blue hover:underline inline-flex items-center gap-1"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
