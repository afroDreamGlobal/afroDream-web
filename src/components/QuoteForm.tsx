'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  ChevronDown,
  Check,
  Clock,
  ShieldCheck,
} from 'lucide-react';

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
  paymentTerms: z.string().min(1, 'Please select or specify payment terms'),
  advancePercentage: z.string().optional(),
  finalPercentage: z.string().optional(),
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

interface CustomSelectOption {
  value: string;
  label: string;
}

const SERVICE_OPTIONS: CustomSelectOption[] = [
  { value: 'Container Shipment', label: 'Container Shipment' },
  { value: 'Bulk Vessel Shipment', label: 'Bulk Vessel Shipment' },
  { value: 'Local Transportation in Bissau and Tanzania', label: 'Local Transportation in Bissau & Tanzania (Truck)' },
  { value: 'Clearing in the Port of Destination (POD)', label: 'Clearing at Port of Destination (Customs / POD)' },
  { value: 'Local Transportation in India', label: 'Local Transportation in India (Truck)' },
];

const CONTAINER_PAYMENT_OPTIONS: CustomSelectOption[] = [
  { value: 'Prepaid', label: 'Prepaid' },
  { value: 'Collect', label: 'Collect' },
];

function CustomSelect({
  label,
  required,
  value,
  options,
  onChange,
  error,
  placeholder = 'Select an option',
}: {
  label: string;
  required?: boolean;
  value: string;
  options: CustomSelectOption[];
  onChange: (val: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-brand-dark mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full text-left text-sm px-4 py-2.5 rounded-xl border bg-slate-50/50 hover:bg-white flex items-center justify-between transition-colors focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue cursor-pointer ${
          isOpen ? 'border-brand-blue ring-4 ring-brand-blue/10 bg-white' : 'border-slate-200'
        }`}
      >
        <span className="truncate pr-2 font-medium text-brand-dark">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-blue' : ''
          }`}
        />
      </button>

      {/* Mobile-Friendly Dropdown List: constrained strictly to 100% width, cannot overflow mobile screen */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 w-full mt-1 bg-white rounded-xl shadow-2xl border border-brand-border overflow-hidden py-1 max-h-60 overflow-y-auto"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 sm:py-3 text-xs sm:text-sm transition-colors flex items-center justify-between cursor-pointer border-b border-gray-100 last:border-b-0 ${
                  isSelected
                    ? 'bg-brand-blue/10 text-brand-blue font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-brand-dark'
                }`}
              >
                <span className="pr-2 leading-snug whitespace-normal break-words text-left">
                  {option.label}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4 text-brand-blue flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const isContainerService = (service: string) => {
  const s = (service || '').toLowerCase();
  return s.includes('container');
};

const isBulkService = (service: string) => {
  const s = (service || '').toLowerCase();
  return s.includes('bulk') || s.includes('vessel');
};

const isTruckService = (service: string) => {
  const s = (service || '').toLowerCase();
  return s.includes('truck') || s.includes('transportation') || s.includes('haulage');
};

export default function QuoteForm({ defaultService = 'Container Shipment' }: QuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialIsContainer = isContainerService(defaultService);
  const initialIsBulk = isBulkService(defaultService);
  const initialPaymentTerms = initialIsContainer
    ? 'Prepaid'
    : initialIsBulk
    ? 'Advance 30% / Final 70%'
    : 'Advance 50% / Final 50%';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      serviceType: defaultService,
      originCountry: 'Tanzania',
      originPort: 'Mtwara Port',
      destinationCountry: 'India',
      destinationPort: 'Tuticorin',
      paymentTerms: initialPaymentTerms,
      advancePercentage: initialIsContainer ? '' : initialIsBulk ? '30' : '50',
      finalPercentage: initialIsContainer ? '' : initialIsBulk ? '70' : '50',
    },
  });

  const selectedService = watch('serviceType') || defaultService;
  const currentPaymentTerms = watch('paymentTerms');
  const advancePercentage = watch('advancePercentage');
  const finalPercentage = watch('finalPercentage');

  // Dynamically update payment terms defaults when service type switches
  useEffect(() => {
    const isContainer = isContainerService(selectedService);
    const isBulk = isBulkService(selectedService);
    const isTruck = isTruckService(selectedService);
    const currentTerms = getValues('paymentTerms');

    if (isContainer) {
      if (currentTerms !== 'Prepaid' && currentTerms !== 'Collect') {
        setValue('paymentTerms', 'Prepaid', { shouldValidate: true });
        setValue('advancePercentage', '');
        setValue('finalPercentage', '');
      }
    } else if (isBulk) {
      if (currentTerms === 'Prepaid' || currentTerms === 'Collect' || !currentTerms) {
        setValue('advancePercentage', '30');
        setValue('finalPercentage', '70');
        setValue('paymentTerms', 'Advance 30% / Final 70%', { shouldValidate: true });
      }
    } else if (isTruck) {
      if (currentTerms === 'Prepaid' || currentTerms === 'Collect' || !currentTerms) {
        setValue('advancePercentage', '50');
        setValue('finalPercentage', '50');
        setValue('paymentTerms', 'Advance 50% / Final 50%', { shouldValidate: true });
      }
    } else {
      if (currentTerms === 'Prepaid' || currentTerms === 'Collect' || !currentTerms) {
        setValue('advancePercentage', '50');
        setValue('finalPercentage', '50');
        setValue('paymentTerms', 'Advance 50% / Final 50%', { shouldValidate: true });
      }
    }
  }, [selectedService, setValue, getValues]);

  const handleAdvanceChange = (val: string) => {
    const num = parseInt(val, 10);
    setValue('advancePercentage', val);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      const remaining = 100 - num;
      setValue('finalPercentage', String(remaining));
      setValue('paymentTerms', `Advance ${num}% / Final ${remaining}%`, { shouldValidate: true });
    } else {
      setValue('paymentTerms', `Advance ${val || 0}% / Final ${finalPercentage || 0}%`, { shouldValidate: true });
    }
  };

  const handleFinalChange = (val: string) => {
    setValue('finalPercentage', val);
    setValue('paymentTerms', `Advance ${advancePercentage || 0}% / Final ${val || 0}%`, { shouldValidate: true });
  };

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
        `Thank you! Your quote request has been registered with reference ${result.data.referenceNumber}. Our commercial team will review your cargo and payment terms (${data.paymentTerms}) and contact you shortly.`
      );
      reset({
        serviceType: defaultService,
        originCountry: 'Tanzania',
        originPort: 'Mtwara Port',
        destinationCountry: 'India',
        destinationPort: 'Tuticorin',
        paymentTerms: isContainerService(defaultService) ? 'Prepaid' : 'Advance 30% / Final 70%',
        advancePercentage: isContainerService(defaultService) ? '' : '30',
        finalPercentage: isContainerService(defaultService) ? '' : '70',
        customerName: '',
        companyName: '',
        email: '',
        phone: '',
        cargoDescription: '',
        cargoWeight: '',
        cargoVolume: '',
        preferredDate: '',
        additionalNotes: '',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(20,50,90,0.12)] border border-slate-200/90 overflow-hidden relative">
      {/* Top decorative gradient bar */}
      <div className="h-2 w-full bg-gradient-to-r from-brand-blue via-cyan-500 to-[#1E67A2]" />

      <div className="p-6 sm:p-9">
        {submitSuccess ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl uppercase text-brand-dark">Quote Request Submitted</h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">{submitSuccess}</p>
            <div className="pt-4">
              <button
                onClick={() => setSubmitSuccess(null)}
                className="btn-primary text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
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

            {/* Header badge inside the form */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-blue font-sans">
                    RATE INQUIRY DISPATCH
                  </span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl uppercase text-brand-dark tracking-tight leading-none mt-1">
                  Freight Rate Calculator
                </h3>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600 self-start sm:self-auto shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-brand-blue" />
                <span>Formal Tariff within 2h</span>
              </div>
            </div>

            {/* Section 1: Contact Information */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Contact Information
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('customerName')}
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
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
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
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
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
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
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Routing & Service */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Shipping Service & Route Corridor
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2 lg:col-span-3">
                  <CustomSelect
                    label="Requested Service"
                    required
                    value={selectedService}
                    options={SERVICE_OPTIONS}
                    onChange={(val) => {
                      setValue('serviceType', val, { shouldValidate: true });
                    }}
                    error={errors.serviceType?.message}
                  />
                  <input type="hidden" {...register('serviceType')} />
                </div>

                {/* Simple Payment Terms: Container = Prepaid / Collect; Bulk & Truck = Advance % / Final Payment % */}
                {isContainerService(selectedService) ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <CustomSelect
                      label="Payment Terms"
                      required
                      value={currentPaymentTerms || 'Prepaid'}
                      options={CONTAINER_PAYMENT_OPTIONS}
                      onChange={(val) => {
                        setValue('paymentTerms', val, { shouldValidate: true });
                        setValue('advancePercentage', '');
                        setValue('finalPercentage', '');
                      }}
                      error={errors.paymentTerms?.message}
                    />
                    <input type="hidden" {...register('paymentTerms')} />
                  </div>
                ) : (
                  <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-dark mb-1">
                        Advance % <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={advancePercentage || ''}
                        onChange={(e) => handleAdvanceChange(e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-dark mb-1">
                        Final Payment % <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={finalPercentage || ''}
                        onChange={(e) => handleFinalChange(e.target.value)}
                        placeholder="e.g. 70"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    {errors.paymentTerms && (
                      <p className="text-xs text-red-500 mt-1 sm:col-span-2">{errors.paymentTerms.message}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Origin Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('originCountry')}
                    type="text"
                    placeholder="e.g. Tanzania"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
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
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
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
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
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
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Target Shipping Date
                  </label>
                  <input
                    {...register('preferredDate')}
                    type="date"
                    className="w-full text-sm px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Cargo Details */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Cargo Details & Quantities
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Commodity / Cargo Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('cargoDescription')}
                    type="text"
                    placeholder="e.g. Raw Cashew Nuts (In Shell), Grade A"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
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
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
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
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400"
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
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all duration-150 text-slate-900 placeholder:text-slate-400 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 text-sm sm:text-base rounded-xl font-bold text-white bg-gradient-to-r from-brand-blue via-[#1E67A2] to-brand-blue hover:from-brand-blue-hover hover:to-brand-blue shadow-lg shadow-brand-blue/25 hover:shadow-xl hover:shadow-brand-blue/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Transmitting Quote Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Freight Quote Request</span>
                  </>
                )}
              </button>

              {/* Security & Trust Row */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Direct Carrier Tariffs</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Zero Spam Guarantee</span>
                </span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
