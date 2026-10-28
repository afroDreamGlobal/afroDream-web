'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { INITIAL_SETTINGS } from '@/lib/store';
import {
  CheckCircle2,
  Save,
  Loader2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Eye,
  Layers,
  LayoutTemplate,
  Link2,
  RefreshCw,
  ArrowRight,
  Check,
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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hero banner upload state
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(null);
  const [bannerUploadSuccess, setBannerUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // About / Corporate profile image upload state
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [aboutUploadError, setAboutUploadError] = useState<string | null>(null);
  const [aboutUploadSuccess, setAboutUploadSuccess] = useState(false);
  const aboutFileInputRef = useRef<HTMLInputElement>(null);

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
      });
  }, []);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setBannerUploadError('Image size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setUploadingBanner(true);
    setBannerUploadError(null);
    setBannerUploadSuccess(false);

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
        setBannerUploadSuccess(true);
        setTimeout(() => setBannerUploadSuccess(false), 3500);
      } else {
        throw new Error(data.error || 'Failed to upload banner image');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setBannerUploadError(msg);
    } finally {
      setUploadingBanner(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setAboutUploadError('Image size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setUploadingAboutImage(true);
    setAboutUploadError(null);
    setAboutUploadSuccess(false);

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
          aboutImageUrl: data.data.secure_url,
        }));
        setAboutUploadSuccess(true);
        setTimeout(() => setAboutUploadSuccess(false), 3500);
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setAboutUploadError(msg);
    } finally {
      setUploadingAboutImage(false);
      if (aboutFileInputRef.current) {
        aboutFileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const msg = err instanceof Error ? err.message : 'Error updating settings';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const showOverlay = settings.showHeroTextOverlay ?? true;
  const showCta = settings.showHeroCtaButtons ?? true;
  const currentBannerUrl =
    settings.heroBannerImageUrl ||
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=85';

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading uppercase text-brand-dark tracking-wide">
          SITE SETTINGS & CONTENT CONFIGURATION
        </h1>
        <p className="text-xs text-brand-muted">
          Manage your hero banner image, text overlay modes, marketing copy, and corporate contact details.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">Site settings successfully updated and saved!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO BANNER MANAGEMENT & GRAPHIC UPLOAD                        */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                <h3 className="font-heading text-lg uppercase text-brand-dark tracking-wide">
                  Homepage Hero Banner
                </h3>
              </div>
              <p className="text-xs text-brand-muted mt-0.5">
                Upload your custom banner graphic or background image. Choose whether to show text overlay or display a pre-designed banner graphic cleanly.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-brand-blue/10 text-brand-blue w-fit">
              <LayoutTemplate className="w-3.5 h-3.5" />
              Customizable Banner
            </span>
          </div>

          {/* Quick link banner to dedicated page */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-blue text-white flex items-center justify-center flex-shrink-0">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Dedicated Hero Banner Management Page</h4>
                <p className="text-[11px] text-slate-600">
                  Manage image uploads, graphic banner modes, and mobile/desktop live preview in a focused interface.
                </p>
              </div>
            </div>
            <Link
              href="/admin/hero"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-xs whitespace-nowrap transition-colors"
            >
              <span>Open Hero Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Banner Mode Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-brand-dark tracking-wider">
              Hero Banner Presentation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Image + Text Overlay */}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, showHeroTextOverlay: true })}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  showOverlay
                    ? 'border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20'
                    : 'border-brand-border hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-brand-dark">
                    <Layers className="w-4 h-4 text-brand-blue" />
                    <span>Background Image + Text Overlay</span>
                  </div>
                  {showOverlay && (
                    <span className="w-4 h-4 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-brand-muted mt-2">
                  Best for photos: Overlays editable badge, bold headline, and subheadline on top of your background photo.
                </p>
              </button>

              {/* Option B: Pre-Created Graphic Banner */}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, showHeroTextOverlay: false })}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  !showOverlay
                    ? 'border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20'
                    : 'border-brand-border hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-brand-dark">
                    <ImageIcon className="w-4 h-4 text-brand-blue" />
                    <span>Pre-Created Graphic Banner</span>
                  </div>
                  {!showOverlay && (
                    <span className="w-4 h-4 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-brand-muted mt-2">
                  Best for Canva / Photoshop banners: Hides text overlay so your pre-designed artwork and text display clearly.
                </p>
              </button>
            </div>
          </div>

          {/* Banner Upload & Image URL */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-bold uppercase text-brand-dark tracking-wider">
              Banner Image Source
            </label>

            {/* Direct File Upload Dropzone / Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
                id="hero-banner-file-input"
              />
              <button
                type="button"
                disabled={uploadingBanner}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs shadow-md shadow-brand-blue/20 transition-all disabled:opacity-60 cursor-pointer"
              >
                {uploadingBanner ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Banner Image...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload New Banner File</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-brand-muted text-center sm:text-left">
                Supports JPG, PNG, WebP (Recommended: 1920×800px or 2560×1080px, max 10MB)
              </span>
            </div>

            {bannerUploadSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Banner image uploaded successfully!</span>
              </div>
            )}

            {bannerUploadError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{bannerUploadError}</span>
              </div>
            )}

            {/* Manual Image URL Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-brand-dark flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-brand-muted" />
                  <span>Banner Image URL (Cloudinary or Direct Web Link)</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      heroBannerImageUrl:
                        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=85',
                    })
                  }
                  className="text-[11px] text-brand-blue hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset to default</span>
                </button>
              </div>
              <input
                type="url"
                value={settings.heroBannerImageUrl || ''}
                onChange={(e) =>
                  setSettings({ ...settings, heroBannerImageUrl: e.target.value })
                }
                placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue font-mono"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider block mb-2">
                Quick Maritime Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_BANNERS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, heroBannerImageUrl: preset.url })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      settings.heroBannerImageUrl === preset.url
                        ? 'bg-brand-dark text-white border-brand-dark'
                        : 'bg-gray-50 hover:bg-gray-100 text-brand-dark border-brand-border'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Display Toggles */}
          <div className="pt-2 border-t border-brand-border space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showOverlay}
                onChange={(e) =>
                  setSettings({ ...settings, showHeroTextOverlay: e.target.checked })
                }
                className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-brand-dark block">
                  Show Text Overlay on Hero Banner
                </span>
                <span className="text-[11px] text-brand-muted block mt-0.5">
                  Keep checked to overlay live text. Uncheck if your uploaded banner already contains graphic text or slogans.
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showCta}
                onChange={(e) =>
                  setSettings({ ...settings, showHeroCtaButtons: e.target.checked })
                }
                className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-brand-dark block">
                  Show Call-to-Action Buttons
                </span>
                <span className="text-[11px] text-brand-muted block mt-0.5">
                  Displays the &quot;Request a Quote&quot; and &quot;Our Services&quot; buttons on the hero banner.
                </span>
              </div>
            </label>
          </div>

          {/* ========================================================================= */}
          {/* LIVE BANNER PREVIEW                                                       */}
          {/* ========================================================================= */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase text-brand-dark tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-blue" />
                <span>Live Hero Preview (Homepage Simulation)</span>
              </label>
              <span className="text-[11px] text-brand-muted font-medium">
                {showOverlay ? 'Mode: Image + Text Overlay' : 'Mode: Pre-Created Graphic Banner (No Text Overlay)'}
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-brand-border shadow-inner bg-brand-dark min-h-[220px] sm:min-h-[280px] flex items-center">
              {/* Preview Background Banner */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url('${currentBannerUrl}')` }}
              >
                {showOverlay ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#110E0F]/95 via-[#16273A]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-black/30" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent" />
                )}
              </div>

              {/* Preview Content */}
              <div className="relative z-10 p-6 sm:p-8 w-full max-w-xl">
                {showOverlay ? (
                  <div className="space-y-2">
                    {/* Badge */}
                    {settings.heroBadge && settings.heroBadge.trim().length > 0 && (
                      <div className="inline-flex items-center gap-1.5 text-brand-blue font-bold text-[10px] tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>{settings.heroBadge}</span>
                      </div>
                    )}

                    {/* Headline */}
                    {settings.heroHeadline && settings.heroHeadline.trim().length > 0 && (
                      <h4 className="text-2xl sm:text-3xl font-heading uppercase text-white leading-tight drop-shadow">
                        {settings.heroHeadline}
                      </h4>
                    )}

                    {/* Subheadline */}
                    {settings.heroSubheadline && settings.heroSubheadline.trim().length > 0 && (
                      <p className="text-xs text-gray-200/90 line-clamp-2 max-w-md font-sans">
                        {settings.heroSubheadline}
                      </p>
                    )}

                    {/* CTA Buttons */}
                    {showCta && (
                      <div className="flex items-center gap-2 pt-2">
                        <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-brand-blue text-white text-[11px] font-bold shadow">
                          <span>Request a Quote</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/20 text-white text-[11px] font-semibold border border-white/20">
                          Our Services
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col justify-end min-h-[160px]">
                    <div className="inline-block px-3 py-1 rounded bg-black/60 backdrop-blur-sm text-[11px] text-white/90 border border-white/20 mb-auto">
                      ✓ Graphic Banner Clean Mode: No text overlay rendered
                    </div>
                    {showCta && (
                      <div className="flex items-center gap-2 bg-brand-dark/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 w-fit">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-blue text-white text-[11px] font-bold">
                          <span>Request a Quote</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-[11px] font-semibold">
                          Our Services
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: HERO TEXT FIELDS (NOT MANDATORY / OPTIONAL)                    */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-border space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <div>
              <h3 className="font-heading text-lg uppercase text-brand-dark tracking-wide">
                Hero Text Overlay Fields
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                All text fields below are <strong className="text-brand-dark">optional</strong>. If left blank or if text overlay is turned off, they will not be shown.
              </p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Not Mandatory
            </span>
          </div>

          {!showOverlay && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
              <span className="text-base">ℹ️</span>
              <span>
                <strong>Text Overlay is currently disabled.</strong> The fields below will be preserved in your settings, but will not be shown over your pre-designed banner graphic on the live site.
              </span>
            </div>
          )}

          <div className={`space-y-4 transition-opacity ${!showOverlay ? 'opacity-60' : 'opacity-100'}`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-brand-dark">
                  Hero Badge Text <span className="text-brand-muted font-normal">(Optional)</span>
                </label>
                <span className="text-[11px] text-brand-muted">Appears in small blue caps above headline</span>
              </div>
              <input
                type="text"
                value={settings.heroBadge || ''}
                onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                placeholder="e.g. RELIABLE SHIPPING SOLUTIONS"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-brand-dark">
                  Main Hero Headline <span className="text-brand-muted font-normal">(Optional)</span>
                </label>
                <span className="text-[11px] text-brand-muted">Rendered in bold Bebas Neue display font</span>
              </div>
              <input
                type="text"
                value={settings.heroHeadline || ''}
                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                placeholder="e.g. CONNECTING AFRICA TO GLOBAL MARKETS"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue font-bold uppercase"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-brand-dark">
                  Supporting Subheadline <span className="text-brand-muted font-normal">(Optional)</span>
                </label>
                <span className="text-[11px] text-brand-muted">Descriptive paragraph in Poppins</span>
              </div>
              <textarea
                rows={3}
                value={settings.heroSubheadline || ''}
                onChange={(e) =>
                  setSettings({ ...settings, heroSubheadline: e.target.value })
                }
                placeholder="e.g. Comprehensive logistics and shipping solutions for Raw Cashew Nuts and global cargo..."
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue resize-none"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: ANNOUNCEMENT BAR                                               */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-border space-y-4">
          <h3 className="font-heading text-lg uppercase text-brand-dark border-b border-brand-border pb-3">
            Top Announcement Bar
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                value={settings.announcementBarText || ''}
                onChange={(e) =>
                  setSettings({ ...settings, announcementBarText: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>
            <label className="flex items-center space-x-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={settings.announcementBarEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, announcementBarEnabled: e.target.checked })
                }
                className="rounded text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-brand-dark font-medium">
                Show Announcement Bar on Public Header
              </span>
            </label>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: ABOUT SECTION CONTENT & CORPORATE PROFILE IMAGE                */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                <h3 className="font-heading text-lg uppercase text-brand-dark tracking-wide">
                  Corporate Profile & Warehouse Facility
                </h3>
              </div>
              <p className="text-xs text-brand-muted mt-0.5">
                Update the homepage About section headline, description, and upload the facility / warehouse image.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-brand-blue/10 text-brand-blue w-fit">
              <ImageIcon className="w-3.5 h-3.5" />
              Uploadable Facility Photo
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                About Headline
              </label>
              <input
                type="text"
                value={settings.aboutHeadline || ''}
                onChange={(e) => setSettings({ ...settings, aboutHeadline: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                About Company Description
              </label>
              <textarea
                rows={4}
                value={settings.aboutDescription || ''}
                onChange={(e) =>
                  setSettings({ ...settings, aboutDescription: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue resize-none"
              />
            </div>

            {/* Corporate Profile Image Upload */}
            <div className="pt-2 border-t border-brand-border space-y-4">
              <label className="block text-xs font-bold uppercase text-brand-dark tracking-wider">
                Corporate Profile / Facility Photo
              </label>

              {/* Upload Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  ref={aboutFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAboutImageUpload}
                  className="hidden"
                  id="about-image-file-input"
                />
                <button
                  type="button"
                  disabled={uploadingAboutImage}
                  onClick={() => aboutFileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs shadow-md shadow-brand-blue/20 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {uploadingAboutImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Image...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Facility Image</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] text-brand-muted text-center sm:text-left">
                  Recommended: 1200×800px or 1600×1000px warehouse or port facility photo (max 10MB)
                </span>
              </div>

              {aboutUploadSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Facility image uploaded successfully!</span>
                </div>
              )}

              {aboutUploadError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{aboutUploadError}</span>
                </div>
              )}

              {/* Direct URL Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-brand-dark flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-brand-muted" />
                    <span>Facility Image URL (Cloudinary or Direct Link)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        aboutImageUrl:
                          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
                      })
                    }
                    className="text-[11px] text-brand-blue hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset to default</span>
                  </button>
                </div>
                <input
                  type="url"
                  value={settings.aboutImageUrl || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, aboutImageUrl: e.target.value })
                  }
                  placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue font-mono"
                />
              </div>

              {/* Live Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-brand-dark tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-brand-blue" />
                    <span>Live Facility Photo Preview</span>
                  </label>
                  <span className="text-[11px] text-brand-muted font-medium">
                    Clean facility photo preview
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-inner bg-brand-dark max-w-lg aspect-[16/10]">
                  <img
                    src={
                      settings.aboutImageUrl ||
                      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85'
                    }
                    alt="Corporate Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 5: FOOTER BRANDING, WHATSAPP & CONTACT DETAILS                     */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-border space-y-6">
          <div className="border-b border-brand-border pb-3">
            <h3 className="font-heading text-lg uppercase text-brand-dark">
              Footer Branding & Company Identity
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Customize the company name and introductory tagline displayed directly in the website footer across all pages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Company Legal / Display Name
              </label>
              <input
                type="text"
                placeholder="Afro Dream Global"
                value={settings.companyName || ''}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                WhatsApp Redirection Number
              </label>
              <input
                type="text"
                placeholder="+255 744 555 890"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Controls the floating WhatsApp chat button and instant booking buttons site-wide.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Footer Tagline / Mission Statement
              </label>
              <textarea
                rows={2}
                placeholder="Premier African shipping, freight forwarding, and multimodal logistics company..."
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Corporate Phone & Email Contacts */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-border space-y-4">
          <div className="border-b border-brand-border pb-3">
            <h3 className="font-heading text-lg uppercase text-brand-dark">
              Corporate Phone & Email Contacts
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              These phone numbers and emails immediately update the website footer, contact page, and quote desk.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Phone (Tanzania / Mtwara Corridor)
              </label>
              <input
                type="text"
                placeholder="+255 744 555 890"
                value={settings.phoneTanzania || ''}
                onChange={(e) => setSettings({ ...settings, phoneTanzania: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Phone (Guinea-Bissau / CAJU SWIFT SARL)
              </label>
              <input
                type="text"
                placeholder="+245 955 888 123"
                value={settings.phoneGuineaBissau || ''}
                onChange={(e) =>
                  setSettings({ ...settings, phoneGuineaBissau: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Phone (India Logistics Desk)
              </label>
              <input
                type="text"
                placeholder="+91 98401 23456"
                value={settings.phoneIndia || ''}
                onChange={(e) => setSettings({ ...settings, phoneIndia: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                General Inquiry Email
              </label>
              <input
                type="email"
                placeholder="info@afrodreamglobal.com"
                value={settings.primaryEmail || ''}
                onChange={(e) => setSettings({ ...settings, primaryEmail: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Freight Quotes & Commercial Desk Email
              </label>
              <input
                type="email"
                placeholder="quotes@afrodreamglobal.com"
                value={settings.quotesEmail || ''}
                onChange={(e) => setSettings({ ...settings, quotesEmail: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Regional Physical Addresses */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-border space-y-4">
          <div className="border-b border-brand-border pb-3">
            <h3 className="font-heading text-lg uppercase text-brand-dark">
              Regional Office Addresses
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Physical office and warehouse locations displayed across the footer and contact directory.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Tanzania Office Address
              </label>
              <input
                type="text"
                placeholder="Mtwara Port Logistics Corridor, Mtwara, Tanzania"
                value={settings.addressTanzania || ''}
                onChange={(e) => setSettings({ ...settings, addressTanzania: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Guinea-Bissau Office Address (CAJU SWIFT SARL)
              </label>
              <input
                type="text"
                placeholder="CAJU SWIFT SARL, Port Commercial Sector, Bissau, Guinea-Bissau"
                value={settings.addressGuineaBissau || ''}
                onChange={(e) =>
                  setSettings({ ...settings, addressGuineaBissau: e.target.value })
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                India Operations Address
              </label>
              <input
                type="text"
                placeholder="Port Logistics Wing, Tuticorin & Mangalore, India"
                value={settings.addressIndia || ''}
                onChange={(e) => setSettings({ ...settings, addressIndia: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Sticky/Fixed Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-brand-border shadow-card sticky bottom-4 z-20">
          <div className="text-xs text-brand-muted hidden sm:block">
            {showOverlay
              ? 'Mode: Dynamic Background + Optional Text Overlay'
              : 'Mode: Pre-Created Graphic Banner (No Text Overlay)'}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary text-xs px-8 py-3.5 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-brand-blue/30 disabled:opacity-70 cursor-pointer ml-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving All Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
