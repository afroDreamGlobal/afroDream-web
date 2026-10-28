'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Linkedin,
  Mail,
  Phone,
  Quote,
  User,
} from 'lucide-react';
import { TeamMember } from '@/lib/types';

interface TeamSectionProps {
  teamMembers?: TeamMember[];
  subHeadline?: string;
  headline?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function TeamSection({
  teamMembers = [],
  subHeadline = 'LEADERSHIP & OPERATIONS',
  headline = 'Our people are our company.',
  subtitle = 'Expertise becomes meaningful when it is shared.',
  ctaText = 'MEET OUR TEAM',
  ctaHref = '/team',
}: TeamSectionProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter only published members
  const publishedMembers = teamMembers.filter((m) => m.isPublished !== false);

  // Sync current slide index when scrolling/swiping
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const card = container.querySelector<HTMLElement>('[data-team-card]');
    if (!card) return;
    const cardWidth = card.offsetWidth + 16; // width + gap
    const index = Math.round(container.scrollLeft / cardWidth);
    const clampedIndex = Math.min(Math.max(index, 0), publishedMembers.length - 1);
    setCurrentIndex(clampedIndex);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const card = container.querySelector<HTMLElement>('[data-team-card]');
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = Math.min(currentIndex + 1, publishedMembers.length - 1);
    scrollToIndex(nextIndex);
  };

  if (!publishedMembers || publishedMembers.length === 0) {
    return null;
  }

  // Format number with leading zero (e.g. "01")
  const formatNum = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // If cards fit comfortably on screen, center them; if more are added, allow smooth scrolling from start
  const shouldCenter = publishedMembers.length <= 4;

  return (
    <section className="py-10 sm:py-16 bg-[#0B1522] text-white relative overflow-hidden border-t border-white/5">
      {/* Subtle background logistics grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#2B7CC0_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Subtle ambient light */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================================= */}
        {/* SECTION HEADER: Single-Line Arrangement + Desktop Carousel Navigation     */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          {/* Left Title Block: Sub-headline / Eyebrow + Headline */}
          <div className="space-y-1.5 flex-shrink-0">
            {subHeadline && (
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-brand-blue block font-sans">
                {subHeadline}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[34px] font-serif tracking-tight text-white font-normal whitespace-normal sm:whitespace-nowrap leading-tight">
              {headline}
            </h2>
          </div>

          {/* Right Subtitle & Link & Desktop Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-start lg:justify-end gap-4 sm:gap-6 lg:gap-8 pt-1 lg:pt-0">
            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-gray-300 font-light italic whitespace-normal lg:whitespace-nowrap leading-relaxed">
              &ldquo;{subtitle}&rdquo;
            </p>

            {/* CTA Link */}
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase text-brand-blue hover:text-brand-blue-hover transition-colors group flex-shrink-0 whitespace-nowrap"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-brand-blue" />
            </Link>

            {/* Desktop Navigation Arrows (Visible when >4 members) */}
            {publishedMembers.length > 4 && (
              <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-white/10">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-sm"
                  aria-label="Previous Slide"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex >= publishedMembers.length - 1}
                  className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-sm"
                  aria-label="Next Slide"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* UNIFIED TEAM CARDS CONTAINER: Smooth Horizontal Scroll & Touch Swipe      */}
        {/* ========================================================================= */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`flex gap-3.5 sm:gap-4 lg:gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none items-stretch ${
            shouldCenter ? 'sm:justify-center' : 'sm:justify-start'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {publishedMembers.map((member, idx) => (
            <div
              key={member.id || idx}
              data-team-card
              onClick={() => setSelectedMember(member)}
              className="w-[250px] sm:w-[260px] lg:w-[270px] flex-shrink-0 snap-center sm:snap-start group cursor-pointer bg-slate-900/90 hover:bg-slate-800/90 border border-white/10 hover:border-white/40 rounded-2xl p-3.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Photo Area — portrait 3:4 ratio so full-body photos display correctly */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 mb-3">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 250px, (max-width: 1024px) 260px, 270px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    /* Elegant placeholder when photo has not been uploaded yet */
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-[#0A1420] text-white p-4 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-white font-serif text-2xl font-bold mb-2 shadow-inner group-hover:scale-105 transition-transform duration-300">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 truncate max-w-[190px]">
                        {member.department || 'Afro Dream Global'}
                      </span>
                    </div>
                  )}

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />
                </div>

                {/* Details: Name and Role */}
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-white font-medium text-sm sm:text-base tracking-wide truncate group-hover:text-white transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors truncate">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Bottom Row with Circular Plus Button */}
              <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-white/10">
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 group-hover:text-white transition-colors">
                  View Profile
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMember(member);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 bg-white/10 group-hover:bg-white group-hover:border-white group-hover:text-black flex items-center justify-center text-white transition-all duration-300 flex-shrink-0 shadow-sm"
                  aria-label={`View details for ${member.name}`}
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-90 duration-300 text-current" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* CONTROLS BAR: Mobile touch controls (Hidden on desktop)                   */}
        {/* Left: 01 / 08  |  Center: Active Pill + Dots  |  Right: (←) (→) buttons   */}
        {/* ========================================================================= */}
        <div className="flex md:hidden items-center justify-between pt-6 sm:pt-8 border-t border-white/10 mt-4 sm:mt-6">
          {/* Left: Dynamic Counter e.g. "01 / 08" */}
          <div className="flex items-center space-x-1.5 font-mono text-xs sm:text-sm select-none">
            <span className="text-brand-blue font-bold tracking-wider">
              {formatNum(currentIndex + 1)}
            </span>
            <span className="text-gray-500 font-semibold">/</span>
            <span className="text-gray-400 font-medium">
              {formatNum(publishedMembers.length)}
            </span>
          </div>

          {/* Center: Elongated Active Pill + Circular Dots */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {publishedMembers.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 ${
                  currentIndex === i
                    ? 'w-6 sm:w-7 h-1.5 sm:h-2 rounded-full bg-brand-blue'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Right: Circular Navigation Arrow Buttons (←) (→) */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all active:scale-95 shadow-sm"
              aria-label="Previous Slide"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= publishedMembers.length - 1}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all active:scale-95 shadow-sm"
              aria-label="Next Slide"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXECUTIVE & OPERATIONS PROFILE MODAL                                      */}
      {/* ========================================================================= */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#0B1522] text-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative border border-white/20 shadow-2xl my-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors focus:outline-none z-10"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden relative border-2 border-white/30 flex-shrink-0 shadow-lg bg-slate-950">
                {selectedMember.imageUrl ? (
                  <Image
                    src={selectedMember.imageUrl}
                    alt={selectedMember.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2">
                    <User className="w-8 h-8 text-brand-blue mb-1" />
                    <span className="text-xs font-serif font-bold">{selectedMember.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left space-y-1.5 flex-1">
                {selectedMember.department && (
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-white bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full">
                    {selectedMember.department}
                  </span>
                )}
                <h3 className="text-2xl font-serif text-white font-normal">
                  {selectedMember.name}
                </h3>
                <p className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
                  {selectedMember.role}
                </p>
              </div>
            </div>

            {selectedMember.quote && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative">
                <Quote className="w-6 h-6 text-white/30 absolute top-2 right-2" />
                <p className="text-xs sm:text-sm text-gray-200 italic leading-relaxed pr-6">
                  &ldquo;{selectedMember.quote}&rdquo;
                </p>
              </div>
            )}

            {selectedMember.bio && selectedMember.bio.trim() !== '' && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                  Professional Profile
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                  {selectedMember.bio}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                {selectedMember.linkedinUrl && (
                  <a
                    href={selectedMember.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white hover:text-black flex items-center justify-center text-white transition-colors border border-white/15"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {selectedMember.email && (
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white hover:text-black flex items-center justify-center text-white transition-colors border border-white/15"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {(selectedMember.whatsapp || selectedMember.phone) && (
                  <a
                    href={`https://wa.me/${(selectedMember.whatsapp || selectedMember.phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] flex items-center justify-center text-white transition-colors border border-white/15"
                    title="Connect on WhatsApp"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>

              <Link
                href="/contact"
                onClick={() => setSelectedMember(null)}
                className="btn-primary text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5"
              >
                <span>Connect via Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
