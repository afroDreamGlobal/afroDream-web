'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

const quoteSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid telephone number'),
  originCountry: z.string().min(2, 'Please specify origin country'),
  originPort: z.string().min(2, 'Please specify origin port'),
  destinationCountry: z.string().min(2, 'Please specify destination country'),
  destinationPort: z.string().min(2, 'Please specify destination port'),
  serviceType: z.string().min(1, 'Please select a shipping service'),
  cargoDescription: z.string().min(3, 'Please describe your cargo (e.g. Raw Cashew Nuts)'),
  cargoWeight: z.string().optional(),
  cargoVolume: z.string().optional(),
  preferredDate: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteFormProps {
  defaultService?: string;
  onSuccess?: () => void;
}

export default function QuoteForm({ defaultService = 'Container Shipment' }: QuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      serviceType: defaultService,
      originCountry: 'Tanzania',
      originPort: 'Mtwara Port',
      destinationCountry: 'India',
      destinationPort: 'Tuticorin',
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit quote request');
      }

      setSubmitSuccess(
        `Thank you! Your quote request has been registered with reference ${result.data.referenceNumber}. Our commercial team will review your specifications and contact you shortly.`
      );
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-brand-border p-6 sm:p-10">
      {submitSuccess ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-2xl uppercase text-brand-dark">Quote Request Submitted</h3>
          <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">{submitSuccess}</p>
          <div className="pt-4">
            <button
              onClick={() => setSubmitSuccess(null)}
              className="btn-primary text-xs px-6 py-2.5 rounded-lg"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {submitError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Section 1: Contact Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-4">
              1. Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('customerName')}
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
                {errors.customerName && (
                  <p className="text-xs text-red-500 mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Company / Organization
                </label>
                <input
                  {...register('companyName')}
                  type="text"
                  placeholder="e.g. Agro Global Exports Ltd"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+91 / +255 / +245 ..."
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Routing & Service */}
          <div className="pt-2 border-t border-brand-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-4">
              2. Shipping Service & Route
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Requested Service <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('serviceType')}
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                >
                  <option value="Container Shipment">Container Shipment (Ocean Freight)</option>
                  <option value="Bulk Vessel Shipment">Bulk Vessel Shipment (Charter / Breakbulk)</option>
                  <option value="Local Transportation in Tanzania">Local Transportation in Tanzania (Inland Haulage)</option>
                  <option value="Clearing in the Port of Destination (POD)">Clearing at Port of Destination (Customs / POD)</option>
                  <option value="Local Transportation in India">Local Transportation in India (Port to Factory)</option>
                </select>
                {errors.serviceType && (
                  <p className="text-xs text-red-500 mt-1">{errors.serviceType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Origin Country <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('originCountry')}
                  type="text"
                  placeholder="e.g. Tanzania"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Origin Port / City <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('originPort')}
                  type="text"
                  placeholder="e.g. Mtwara Port"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Destination Country <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('destinationCountry')}
                  type="text"
                  placeholder="e.g. India"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Destination Port <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('destinationPort')}
                  type="text"
                  placeholder="e.g. Tuticorin / Mangalore"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Target Shipping Date
                </label>
                <input
                  {...register('preferredDate')}
                  type="date"
                  className="w-full text-sm px-4 py-2 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Cargo Details */}
          <div className="pt-2 border-t border-brand-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-4">
              3. Cargo Details & Volumes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Commodity / Cargo Description <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('cargoDescription')}
                  type="text"
                  placeholder="e.g. Raw Cashew Nuts (In Shell), Grade A"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
                {errors.cargoDescription && (
                  <p className="text-xs text-red-500 mt-1">{errors.cargoDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Estimated Weight / Quantity
                </label>
                <input
                  {...register('cargoWeight')}
                  type="text"
                  placeholder="e.g. 500 Metric Tons (MT)"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Container Requirements / Volume
                </label>
                <input
                  {...register('cargoVolume')}
                  type="text"
                  placeholder="e.g. 25 x 40ft High Cube Containers"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Special Instructions or Requirements
                </label>
                <textarea
                  {...register('additionalNotes')}
                  rows={3}
                  placeholder="Specify phytosanitary certification, warehouse storage, customs brokerage, or specific transit schedules needed..."
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-base rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-brand-blue/20 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transmitting Quote Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Freight Quote Request</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-gray-500 text-center mt-2">
              Our freight desk reviews all requests against current sailing schedules and verified carrier tariffs.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
