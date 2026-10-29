'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  X,
  Linkedin,
  Mail,
  Phone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Quote,
  Users,
  User,
} from 'lucide-react';
import { TeamMember } from '@/lib/types';

interface TeamClientViewProps {
  initialMembers: TeamMember[];
}

interface TeamSectionRowProps {
  title: string;
  subtitle: string;
  members: TeamMember[];
  renderCard: (member: TeamMember) => React.ReactNode;
}

function TeamSectionRow({
  title,
  subtitle,
  members,
  renderCard,
}: TeamSectionRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [members]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 280;
    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  const isCentered = members.length <= 4;

  return (
    <div className="space-y-6">
      {/* Centered Heading */}
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center space-y-1.5 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-blue block">
            {subtitle}
          </span>
          <h2 className="font-heading uppercase tracking-wide text-white text-3xl sm:text-4xl">
            {title}
          </h2>
        </div>

        {/* Scroll navigation arrows for desktop when more than 4 cards */}
        {members.length > 4 && (
          <div className="hidden sm:flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-sm"
              aria-label="Previous Members"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-sm"
              aria-label="Next Members"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4 cards visible on desktop, single row horizontal scroll on mobile */}
      <div className="relative max-w-6xl mx-auto px-4">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className={`flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none items-stretch ${
            isCentered ? 'justify-start lg:justify-center' : 'justify-start'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {members.map(renderCard)}
        </div>
      </div>
    </div>
  );
}

export default function TeamClientView({ initialMembers }: TeamClientViewProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Prevent background scroll when the member profile popup is open
  useEffect(() => {
    if (selectedMember) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedMember(null);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedMember]);

  // Helper to identify members belonging to Tanzanian Operations
  const isTanzaniaOperation = (m: TeamMember) => {
    const dept = (m.department || '').toLowerCase();
    const div = (m.division || '').toLowerCase();
    const role = (m.role || '').toLowerCase();
    const name = (m.name || '').toLowerCase();
    return (
      dept.includes('tanzan') ||
      div.includes('tanzan') ||
      role.includes('tanzan') ||
      name.includes('danford')
    );
  };

  const executiveMembers = initialMembers.filter((m) => !isTanzaniaOperation(m));
  const tanzaniaMembers = initialMembers.filter((m) => isTanzaniaOperation(m));

  // Reusable member card renderer — identical to the homepage team card
  const renderCard = (member: TeamMember) => (
    <div
      key={member.id}
      onClick={() => setSelectedMember(member)}
      className="w-[250px] sm:w-[260px] lg:w-[270px] flex-shrink-0 snap-center sm:snap-start group cursor-pointer bg-slate-900/90 hover:bg-slate-800/90 border border-white/10 hover:border-white/40 rounded-2xl p-3.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1 flex flex-col justify-between"
    >
      <div>
        {/* Photo Area — identical to homepage portrait 3:4 ratio */}
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
              <div className="w-16 h-16 rounded-2xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-white font-heading text-3xl font-bold mb-2 shadow-inner group-hover:scale-105 transition-transform duration-300">
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

      {/* Bottom Row: View Profile */}
      <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between">
        <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 group-hover:text-white transition-colors">
          View Profile
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-16 sm:space-y-20">
      {initialMembers.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/80 rounded-2xl border border-white/10 max-w-xl mx-auto space-y-3">
          <Users className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-xl font-heading uppercase tracking-wide text-white">Personnel Directory</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-light">
            Team members will appear here once added and published in the admin operations portal.
          </p>
        </div>
      ) : (
        <div className="space-y-16 sm:space-y-20">
          {/* ========================================================================= */}
          {/* SECTION 1: EXECUTIVE LEADERSHIP (4 cards on desktop, 1 row scroll on mobile) */}
          {/* ========================================================================= */}
          {executiveMembers.length > 0 && (
            <TeamSectionRow
              title="Corporate Leadership & Maritime Strategy"
              subtitle="EXECUTIVE LEADERSHIP"
              members={executiveMembers}
              renderCard={renderCard}
            />
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: TANZANIAN OPERATION TEAM (4 cards on desktop, 1 row on mobile) */}
          {/* ========================================================================= */}
          {tanzaniaMembers.length > 0 && (
            <div className="pt-12 sm:pt-16 border-t border-white/10">
              <TeamSectionRow
                title="Tanzanian Operation Team"
                subtitle="REGIONAL PORT OPERATIONS"
                members={tanzaniaMembers}
                renderCard={renderCard}
              />
            </div>
          )}
        </div>
      )}

      {/* Profile Detail Modal */}
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
                    <span className="text-xs font-heading font-bold">{selectedMember.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left space-y-1.5 flex-1">
                {selectedMember.department && (
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-white bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full">
                    {selectedMember.department}
                  </span>
                )}
                <h3 className="text-2xl font-sans font-bold text-white tracking-tight">
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
    </div>
  );
}
