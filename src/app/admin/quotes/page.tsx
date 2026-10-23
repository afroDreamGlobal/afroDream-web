'use client';

import React, { useEffect, useState } from 'react';
import { QuoteRequest, QuoteStatus } from '@/lib/types';
import { Search, Filter, Phone, Mail, Clock, Calendar, CheckCircle, X, Loader2 } from 'lucide-react';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [newStatus, setNewStatus] = useState<QuoteStatus>('new');
  const [internalNotes, setInternalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuotes = () => {
    setIsLoading(true);
    fetch('/api/quotes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setQuotes(data.data);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleOpenDetail = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setNewStatus(quote.status);
    setInternalNotes(quote.internalNotes || '');
  };

  const handleUpdateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/quotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedQuote.id,
          status: newStatus,
          internalNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedQuote(null);
        fetchQuotes();
      }
    } catch (err) {
      alert('Error updating quote');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.companyName && q.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'quoted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected':
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading uppercase text-brand-dark tracking-wide">
          QUOTE ENQUIRIES & BOOKING INQUIRIES
        </h1>
        <p className="text-xs text-brand-muted">
          Review commodity specifications, assign tariffs, and record commercial follow-ups.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-brand-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, ref #, email..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'new', 'reviewing', 'quoted', 'accepted', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-brand-bg text-brand-muted hover:text-brand-dark'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-brand-border">
              <tr>
                <th className="py-3.5 px-6">Reference</th>
                <th className="py-3.5 px-6">Customer & Company</th>
                <th className="py-3.5 px-6">Service</th>
                <th className="py-3.5 px-6">Origin &rarr; POD</th>
                <th className="py-3.5 px-6">Cargo Description</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  onClick={() => handleOpenDetail(quote)}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-semibold text-brand-dark text-xs">
                    {quote.referenceNumber}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-brand-dark text-xs">{quote.customerName}</div>
                    <div className="text-[11px] text-brand-muted">{quote.companyName || quote.email}</div>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-700 font-medium">{quote.serviceType}</td>
                  <td className="py-4 px-6 text-xs text-gray-700">
                    {quote.originPort} &rarr; {quote.destinationPort}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600 max-w-xs truncate">
                    {quote.cargoDescription}
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
                    <button className="text-xs font-semibold text-brand-blue hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Detail & Status Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block">
                  Quote Reference Number
                </span>
                <h3 className="font-heading text-2xl uppercase text-brand-dark">
                  {selectedQuote.referenceNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-brand-bg p-4 rounded-xl border border-brand-border">
              <div>
                <span className="text-brand-muted block font-medium">Customer Name</span>
                <span className="font-bold text-brand-dark text-sm mt-0.5 block">
                  {selectedQuote.customerName}
                </span>
              </div>
              <div>
                <span className="text-brand-muted block font-medium">Company</span>
                <span className="font-bold text-brand-dark text-sm mt-0.5 block">
                  {selectedQuote.companyName || 'Individual Trader'}
                </span>
              </div>
              <div>
                <span className="text-brand-muted block font-medium">Email Address</span>
                <a
                  href={`mailto:${selectedQuote.email}`}
                  className="font-semibold text-brand-blue hover:underline mt-0.5 block"
                >
                  {selectedQuote.email}
                </a>
              </div>
              <div>
                <span className="text-brand-muted block font-medium">Contact Phone</span>
                <a
                  href={`tel:${selectedQuote.phone}`}
                  className="font-semibold text-brand-blue hover:underline mt-0.5 block"
                >
                  {selectedQuote.phone}
                </a>
              </div>
            </div>

            {/* Freight & Cargo Specs */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-brand-dark">Cargo & Routing</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-muted block">Origin Port</span>
                  <span className="font-semibold text-brand-dark">
                    {selectedQuote.originPort}, {selectedQuote.originCountry}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-muted block">Destination Port</span>
                  <span className="font-semibold text-brand-dark">
                    {selectedQuote.destinationPort}, {selectedQuote.destinationCountry}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-muted block">Service Requested</span>
                  <span className="font-semibold text-brand-dark">{selectedQuote.serviceType}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-brand-muted block">Volume / Weight</span>
                  <span className="font-semibold text-brand-dark">
                    {selectedQuote.cargoWeight || 'N/A'} {selectedQuote.cargoVolume ? `(${selectedQuote.cargoVolume})` : ''}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-brand-muted block">Commodity Details</span>
                <p className="font-medium text-brand-dark mt-1">{selectedQuote.cargoDescription}</p>
                {selectedQuote.additionalNotes && (
                  <p className="text-gray-600 mt-2 italic">
                    Notes: &ldquo;{selectedQuote.additionalNotes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Status & Notes Form */}
            <form onSubmit={handleUpdateQuote} className="space-y-4 pt-4 border-t border-brand-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Enquiry Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as QuoteStatus)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:border-brand-blue"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="reviewing">Under Review / Tariff Verification</option>
                    <option value="quoted">Quoted to Customer</option>
                    <option value="accepted">Accepted / Booking Confirmed</option>
                    <option value="rejected">Rejected / No Space Available</option>
                    <option value="closed">Closed / Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Submission Time
                  </label>
                  <div className="text-xs text-gray-500 py-2">
                    {new Date(selectedQuote.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Internal Commercial Notes (Administrative Only)
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Carrier rate references, agreed container slot allotment, follow-up dates..."
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="btn-secondary text-xs px-5 py-2 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary text-xs px-6 py-2 rounded-lg font-semibold flex items-center space-x-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
