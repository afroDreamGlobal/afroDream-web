'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  X,
  Linkedin,
  Mail,
  Phone,
  ArrowRight,
  Quote,
  Users,
} from 'lucide-react';
import { TeamMember } from '@/lib/types';

interface TeamClientViewProps {
  initialMembers: TeamMember[];
}

export default function TeamClientView({ initialMembers }: TeamClientViewProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Derive unique departments
  const departments = [
    'All',
    ...Array.from(
      new Set(
        initialMembers
          .map((m) => m.department)
          .filter((d): d is string => Boolean(d && d.trim() !== ''))
      )
    ),
  ];

  const filteredMembers =
    selectedDepartment === 'All'
      ? initialMembers
      : initialMembers.filter((m) => m.department === selectedDepartment);

  return (
    <div className="space-y-12">
      {/* Department Filter Pills */}
      {departments.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {departments.map((dept) => {
            const isActive = selectedDepartment === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 border ${
                  isActive
                    ? 'bg-white text-slate-950 border-white shadow-md scale-105'
                    : 'bg-white/5 text-gray-300 border-white/15 hover:border-white/40 hover:text-white'
                }`}
              >
                {dept === 'All' ? 'All Leadership' : dept}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid of Team Members */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/80 rounded-2xl border border-white/10 max-w-xl mx-auto space-y-3">
          <Users className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-lg font-serif text-white">Personnel Directory</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-light">
            Team members and corporate leadership will appear here once added and published in the admin operations portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="group cursor-pointer bg-slate-900/90 text-white rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Photo (operation badge completely removed) */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 mb-4">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white font-serif text-3xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                </div>

                {/* Title & Name (White font color, no yellow) */}
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-serif text-white font-medium group-hover:text-white transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {member.role}
                  </p>
                </div>

                {/* Bio summary */}
                {member.bio && (
                  <p className="text-xs text-gray-300 line-clamp-3 mt-3 font-light leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Bottom Row */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-300 group-hover:text-white transition-colors flex items-center gap-1">
                  <span>View Full Profile</span>
                </span>

                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-white/20 bg-white/10 group-hover:bg-white group-hover:border-white group-hover:text-black flex items-center justify-center text-white transition-all shadow-sm"
                  aria-label={`Open details for ${member.name}`}
                >
                  <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300 text-current" />
                </button>
              </div>
            </div>
          ))}
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
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-white font-serif text-3xl font-bold">
                    {selectedMember.name.charAt(0)}
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

            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                Professional Profile
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                {selectedMember.bio ||
                  'Key corporate executive managing international freight corridors, maritime documentation, and client operations at Afro Dream Global.'}
              </p>
            </div>

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
