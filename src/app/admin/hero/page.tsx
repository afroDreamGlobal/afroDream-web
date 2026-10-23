'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { INITIAL_SETTINGS } from '@/lib/store';
import {
  Sparkles,
  Image as ImageIcon,
  Upload,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Link2,
  ExternalLink,
  Smartphone,
  Monitor,
  ArrowRight,
  Check,
  Trash2,
} from 'lucide-react';

const PRESET_BANNERS = [
  {
    name: 'Mtwara Container Port (Default)',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Maritime Cargo Vessel',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Tanzania Inland Logistics',
    url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2000&q=85',
  },
  {
    name: 'Global Container Terminal',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=85',
  },
];

export default function AdminHeroPage() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Desktop upload states
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [desktopUploadError, setDesktopUploadError] = useState<string | null>(null);
  const [desktopUploadSuccess, setDesktopUploadSuccess] = useState(false);
  const desktopFileInputRef = useRef<HTMLInputElement>(null);

  // Mobile upload states
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [mobileUploadError, setMobileUploadError] = useState<string | null>(null);
  const [mobileUploadSuccess, setMobileUploadSuccess] = useState(false);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  // Active image manager tab: 'desktop' | 'mobile'
  const [activeUploadTab, setActiveUploadTab] = useState<'desktop' | 'mobile'>('desktop');

  // Live preview device toggle: 'desktop' | 'mobile'
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      })
      .catch((err) => {
        console.warn('Could not load remote settings, using default store settings:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Upload Desktop Banner
  const handleDesktopUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setDesktopUploadError('Image size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setUploadingDesktop(true);
    setDesktopUploadError(null);
    setDesktopUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.secure_url) {
        setSettings((prev) => ({
          ...prev,
          heroBannerImageUrl: data.data.secure_url,
        }));
        setDesktopUploadSuccess(true);
        setTimeout(() => setDesktopUploadSuccess(false), 3500);
      } else {
        throw new Error(data.error || 'Failed to upload desktop banner image');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setDesktopUploadError(msg);
    } finally {
      setUploadingDesktop(false);
      if (desktopFileInputRef.current) {
        desktopFileInputRef.current.value = '';
      }
    }
  };

  // Upload Mobile Banner
  const handleMobileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMobileUploadError('Image size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setUploadingMobile(true);
    setMobileUploadError(null);
    setMobileUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.secure_url) {
        setSettings((prev) => ({
          ...prev,
          heroMobileBannerImageUrl: data.data.secure_url,
        }));
        setMobileUploadSuccess(true);
        setTimeout(() => setMobileUploadSuccess(false), 3500);
      } else {
        throw new Error(data.error || 'Failed to upload mobile banner image');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setMobileUploadError(msg);
    } finally {
      setUploadingMobile(false);
      if (mobileFileInputRef.current) {
        mobileFileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        throw new Error(data.error || 'Failed to update settings');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const currentDesktopBanner =
    settings.heroBannerImageUrl?.trim() || PRESET_BANNERS[0].url;

  const currentMobileBanner =
    settings.heroMobileBannerImageUrl?.trim() || currentDesktopBanner;

  const hasCustomMobileBanner =
    Boolean(settings.heroMobileBannerImageUrl && settings.heroMobileBannerImageUrl.trim().length > 0);

  const showOverlay = settings.showHeroTextOverlay ?? true;
  const showCta = settings.showHeroCtaButtons ?? true;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
          <span className="text-sm font-medium">Loading Hero Banner configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* TOP BAR: HEADER + ACTION BUTTONS                                          */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-[11px] font-bold uppercase tracking-wider">
              Homepage Showcase
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading uppercase text-slate-900 tracking-tight">
            Hero Banner Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure separate high-res banners for desktop screens and mobile phones.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>View Public Site</span>
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md shadow-brand-blue/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SUCCESS & ERROR NOTIFICATIONS */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Hero banner updated successfully!</span> Changes are immediately live on the homepage.
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs sm:text-sm flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Error saving changes:</span> {errorMessage}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PRESENTATION MODE SELECTOR                                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-blue" />
            <span>Step 1: Choose Banner Presentation Style</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Decide whether to show a pre-designed graphic banner or photo with live editable headlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Mode Option A: Pre-Created Graphic Banner */}
          <div
            onClick={() => setSettings((prev) => ({ ...prev, showHeroTextOverlay: false }))}
            className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
              !showOverlay
                ? 'border-brand-blue bg-blue-50/40 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                !showOverlay ? 'bg-brand-blue text-white shadow-xs' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Pre-Created Graphic Banner
                </span>
                {!showOverlay && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-blue text-white text-[10px] font-bold uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                <strong>No text overlay.</strong> Recommended if your uploaded graphics already contain artwork, logos, and promotional typography.
              </p>
            </div>
          </div>

          {/* Mode Option B: Background Image + Text Overlay */}
          <div
            onClick={() => setSettings((prev) => ({ ...prev, showHeroTextOverlay: true }))}
            className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
              showOverlay
                ? 'border-brand-blue bg-blue-50/40 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                showOverlay ? 'bg-brand-blue text-white shadow-xs' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Background Image + Text Overlay
                </span>
                {showOverlay && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-blue text-white text-[10px] font-bold uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Applies a dark gradient scrim with custom headline, subtitle, and dual call-to-action buttons.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DUAL BANNER UPLOADER: DESKTOP SIZE & MOBILE SIZE                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-blue" />
            <span>Step 2: Upload Desktop &amp; Mobile Banner Images</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure different banner graphics tailored for widescreen monitors and portrait mobile screens.
          </p>
        </div>

        {/* Tab Switcher: Desktop vs Mobile Image */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveUploadTab('desktop')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition-all ${
              activeUploadTab === 'desktop'
                ? 'border-brand-blue text-brand-blue bg-blue-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop Banner (16:9 / Landscape)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveUploadTab('mobile')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition-all ${
              activeUploadTab === 'mobile'
                ? 'border-brand-blue text-brand-blue bg-blue-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile Banner (Portrait / Phone Size)</span>
            {hasCustomMobileBanner && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Custom mobile banner set" />
            )}
          </button>
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: DESKTOP BANNER UPLOADER                                        */}
        {/* ===================================================================== */}
        {activeUploadTab === 'desktop' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Desktop Banner (Widescreen)
                </span>
                <span className="text-[11px] text-slate-400">
                  Recommended resolution: <strong>1920×800 px</strong> or <strong>16:9</strong> landscape.
                </span>
              </div>
              {settings.heroBannerImageUrl && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  Image Active
                </span>
              )}
            </div>

            {/* Desktop Upload Dropzone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-brand-blue rounded-2xl p-6 sm:p-8 text-center transition-all bg-slate-50/50 hover:bg-blue-50/20 group">
              <input
                type="file"
                ref={desktopFileInputRef}
                onChange={handleDesktopUpload}
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                id="desktop-file-upload"
              />

              <div className="flex flex-col items-center max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand-blue shadow-xs group-hover:scale-105 transition-transform">
                  {uploadingDesktop ? (
                    <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                  ) : (
                    <Monitor className="w-6 h-6 text-brand-blue" />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="desktop-file-upload"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md shadow-brand-blue/25 transition-all"
                  >
                    <span>{uploadingDesktop ? 'Uploading Desktop Banner...' : 'Upload Desktop Banner'}</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Supports PNG, JPG, or WebP. Maximum file size: 10MB.
                  </p>
                </div>
              </div>

              {desktopUploadSuccess && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Desktop banner successfully uploaded to Cloudinary!</span>
                </div>
              )}

              {desktopUploadError && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{desktopUploadError}</span>
                </div>
              )}
            </div>

            {/* Direct URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Desktop Image Direct URL</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={settings.heroBannerImageUrl || ''}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      heroBannerImageUrl: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-blue font-mono bg-slate-50/50"
                />
                {settings.heroBannerImageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        heroBannerImageUrl: PRESET_BANNERS[0].url,
                      }))
                    }
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                Or Pick a Desktop Preset:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PRESET_BANNERS.map((preset, idx) => {
                  const isSelected = settings.heroBannerImageUrl === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          heroBannerImageUrl: preset.url,
                        }))
                      }
                      className={`p-2 rounded-xl border text-left transition-all group flex flex-col gap-2 ${
                        isSelected
                          ? 'border-brand-blue bg-blue-50/50 ring-2 ring-brand-blue/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className="h-20 w-full rounded-lg bg-cover bg-center border border-slate-200/50 relative overflow-hidden"
                        style={{ backgroundImage: `url('${preset.url}')` }}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 truncate px-1">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: MOBILE BANNER UPLOADER                                         */}
        {/* ===================================================================== */}
        {activeUploadTab === 'mobile' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Mobile Banner (Phone Size)
                </span>
                <span className="text-[11px] text-slate-400">
                  Recommended resolution: <strong>1080×1350 px</strong> (portrait) or <strong>1080×1080 px</strong> (square).
                </span>
              </div>
              {hasCustomMobileBanner ? (
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  Custom Mobile Active
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-medium">
                  Using Desktop Image (Fallback)
                </span>
              )}
            </div>

            {/* Mobile Upload Dropzone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-brand-blue rounded-2xl p-6 sm:p-8 text-center transition-all bg-slate-50/50 hover:bg-blue-50/20 group">
              <input
                type="file"
                ref={mobileFileInputRef}
                onChange={handleMobileUpload}
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                id="mobile-file-upload"
              />

              <div className="flex flex-col items-center max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand-blue shadow-xs group-hover:scale-105 transition-transform">
                  {uploadingMobile ? (
                    <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                  ) : (
                    <Smartphone className="w-6 h-6 text-brand-blue" />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mobile-file-upload"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md shadow-brand-blue/25 transition-all"
                  >
                    <span>{uploadingMobile ? 'Uploading Mobile Banner...' : 'Upload Mobile Banner'}</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Supports PNG, JPG, or WebP portrait banners created for mobile phone screens.
                  </p>
                </div>
              </div>

              {mobileUploadSuccess && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mobile banner successfully uploaded to Cloudinary!</span>
                </div>
              )}

              {mobileUploadError && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{mobileUploadError}</span>
                </div>
              )}
            </div>

            {/* Direct Mobile URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Mobile Image Direct URL</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={settings.heroMobileBannerImageUrl || ''}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      heroMobileBannerImageUrl: e.target.value,
                    }))
                  }
                  placeholder="https://... (leave blank to use desktop image on mobile)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-blue font-mono bg-slate-50/50"
                />
                {settings.heroMobileBannerImageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        heroMobileBannerImageUrl: '',
                      }))
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                    title="Remove mobile-specific banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Note: If no mobile banner is specified, mobile devices automatically display the desktop banner image.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. TEXT OVERLAY CONTENT (Only relevant when overlay is enabled)           */}
      {/* ========================================================================= */}
      {showOverlay && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-blue" />
              <span>Step 3: Text &amp; Call-To-Action Overlay Content</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the text rendered on top of the hero image. Leave any field blank if you do not want it displayed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Badge Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Top Status Badge
              </label>
              <input
                type="text"
                value={settings.heroBadge || ''}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, heroBadge: e.target.value }))
                }
                placeholder="RELIABLE SHIPPING SOLUTIONS"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-blue uppercase tracking-wider"
              />
            </div>

            {/* CTA Buttons Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Action Buttons
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCta}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        showHeroCtaButtons: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                  <span className="ml-3 text-xs font-semibold text-slate-700">
                    Display &quot;Request a Quote&quot; &amp; &quot;Track Consignment&quot; buttons
                  </span>
                </label>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                Main Headline (Bebas Neue)
              </label>
              <input
                type="text"
                value={settings.heroHeadline || ''}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, heroHeadline: e.target.value }))
                }
                placeholder="CONNECTING AFRICA TO GLOBAL MARKETS"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm sm:text-base font-bold focus:outline-none focus:border-brand-blue uppercase tracking-tight"
              />
            </div>

            {/* Subheadline / Paragraph */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                Subtitle Description (Poppins)
              </label>
              <textarea
                rows={3}
                value={settings.heroSubheadline || ''}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    heroSubheadline: e.target.value,
                  }))
                }
                placeholder="Comprehensive logistics and shipping solutions for Raw Cashew Nuts and global cargo..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-blue leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REAL-TIME RESPONSIVE LIVE PREVIEW                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-blue" />
              <span>Step 4: Real-Time Live Preview</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggling between devices displays the matching Desktop or Mobile image.
            </p>
          </div>

          {/* Desktop vs Mobile Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                previewDevice === 'desktop'
                  ? 'bg-white text-brand-blue shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                previewDevice === 'mobile'
                  ? 'bg-white text-brand-blue shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View</span>
            </button>
          </div>
        </div>

        {/* Device Image Info Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <span>
            Simulating: <strong>{previewDevice === 'desktop' ? 'Desktop Viewport (Widescreen)' : 'Mobile Viewport (Smartphone)'}</strong>
          </span>
          <span className="text-[11px] font-semibold text-brand-blue">
            {previewDevice === 'desktop'
              ? 'Showing Desktop Image'
              : hasCustomMobileBanner
              ? 'Showing Custom Mobile Image'
              : 'Showing Desktop Image (Fallback)'}
          </span>
        </div>

        {/* Preview Frame */}
        <div className="flex justify-center bg-slate-900 rounded-2xl p-4 sm:p-8 overflow-hidden">
          <div
            className={`transition-all duration-300 relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${
              previewDevice === 'mobile'
                ? 'w-[360px] min-h-[500px]'
                : 'w-full min-h-[420px]'
            }`}
          >
            {/* Background Image: Desktop image on desktop view, Mobile image on mobile view */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{
                backgroundImage: `url('${
                  previewDevice === 'desktop' ? currentDesktopBanner : currentMobileBanner
                }')`,
              }}
            >
              {showOverlay ? (
                previewDevice === 'mobile' ? (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/65 pointer-events-none" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#110E0F]/95 via-[#16273A]/85 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                  </>
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              )}
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 p-6 sm:p-10 h-full flex flex-col justify-center">
              {showOverlay ? (
                <div className="max-w-xl space-y-3">
                  {settings.heroBadge && (
                    <div className="inline-flex items-center gap-2">
                      <span className="text-cyan-400 tracking-[0.2em] uppercase font-bold text-[10px] sm:text-xs font-sans flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>{settings.heroBadge}</span>
                      </span>
                    </div>
                  )}

                  <h3 className="text-3xl sm:text-5xl font-heading font-normal uppercase text-white leading-[0.95] tracking-tight drop-shadow-md">
                    {settings.heroHeadline || 'CONNECTING AFRICA TO GLOBAL MARKETS'}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-200/90 font-light leading-relaxed max-w-md line-clamp-3">
                    {settings.heroSubheadline ||
                      'Comprehensive logistics and shipping solutions for Raw Cashew Nuts and global cargo.'}
                  </p>

                  {showCta && (
                    <div className="flex flex-row items-center gap-2 pt-2">
                      <div className="h-9 px-4 rounded-lg bg-brand-blue text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
                        <span>Request a Quote</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                      <div className="h-9 px-4 rounded-lg bg-white/10 border border-white/20 text-white font-semibold text-xs flex items-center">
                        <span>Track Cargo</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium">
                  {previewDevice === 'mobile' ? 'Mobile Graphic Banner' : 'Desktop Graphic Banner'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-6 z-20 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold shadow-xl shadow-brand-blue/35 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Hero Banner</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
