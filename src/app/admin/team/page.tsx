'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  EyeOff,
  Check,
  X,
  Upload,
  Loader2,
  Search,
  Linkedin,
  Mail,
  Phone,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { TeamMember } from '@/lib/types';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchTeam = () => {
    setIsLoading(true);
    fetch('/api/admin/team')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTeam(data.data);
        }
      })
      .catch((err) => console.error('Error fetching team:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleTogglePublish = async (member: TeamMember) => {
    const updated = { ...member, isPublished: !member.isPublished };
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(`${member.name} is now ${updated.isPublished ? 'Published' : 'Draft'}`);
        fetchTeam();
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from team?`)) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Removed ${name}`);
        fetchTeam();
      }
    } catch {
      alert('Failed to delete team member');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= team.length) return;

    const currentMember = team[index];
    const targetMember = team[targetIndex];

    const currentOrder = currentMember.displayOrder ?? index + 1;
    const targetOrder = targetMember.displayOrder ?? targetIndex + 1;

    // Swap display order
    await fetch('/api/admin/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...currentMember, displayOrder: targetOrder }),
    });

    await fetch('/api/admin/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...targetMember, displayOrder: currentOrder }),
    });

    fetchTeam();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.role) {
      alert('Please enter both Name and Role.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingMember(null);
        showFeedback(`Saved team member ${editingMember.name}`);
        fetchTeam();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch {
      alert('Error saving team member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setEditingMember((prev) => ({
          ...prev,
          imageUrl: data.data.secure_url,
        }));
        showFeedback('Photo uploaded successfully');
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch {
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredTeam = team.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      (m.department && m.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed top-6 right-6 z-50 bg-brand-dark text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-brand-blue/40 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-brand-blue" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-blue uppercase tracking-widest mb-1">
            <span>Corporate Personnel</span>
            <span>•</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Supabase Connected
            </span>
          </div>
          <h1 className="text-3xl font-heading uppercase text-brand-dark tracking-wide">
            TEAM MANAGEMENT
          </h1>
          <p className="text-xs text-brand-muted">
            Add, update, or reorder company executives, heads, and field leaders displayed on the homepage & /team page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingMember({
                name: '',
                role: '',
                department: '',
                bio: '',
                imageUrl: '',
                displayOrder: team.length + 1,
                isPublished: true,
                email: '',
                phone: '',
                whatsapp: '',
                linkedinUrl: '',
                quote: '',
              });
              setIsModalOpen(true);
            }}
            className="btn-primary text-xs px-5 py-2.5 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, role, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div className="text-xs text-gray-500 font-medium flex items-center gap-3">
          <span>
            Total Members: <strong className="text-brand-dark">{team.length}</strong>
          </span>
          <span>•</span>
          <span>
            Published: <strong className="text-emerald-600">{team.filter((t) => t.isPublished).length}</strong>
          </span>
          <span>•</span>
          <span>
            Draft: <strong className="text-amber-600">{team.filter((t) => !t.isPublished).length}</strong>
          </span>
        </div>
      </div>

      {/* Team Members Grid / Table */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-brand-border">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto mb-3" />
          <p className="text-xs text-gray-500">Loading team members from Supabase...</p>
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-brand-border">
          <p className="text-sm text-gray-600 font-semibold mb-2">No team members found</p>
          <p className="text-xs text-gray-400 mb-4">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Start by adding your first team member.'}
          </p>
          <button
            onClick={() => {
              setEditingMember({
                name: '',
                role: '',
                department: '',
                bio: '',
                imageUrl: '',
                displayOrder: 1,
                isPublished: true,
              });
              setIsModalOpen(true);
            }}
            className="btn-primary text-xs px-4 py-2 rounded-lg"
          >
            Add Team Member
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-brand-border">
                <tr>
                  <th className="py-3.5 px-6">Order</th>
                  <th className="py-3.5 px-6">Profile Photo</th>
                  <th className="py-3.5 px-6">Name & Role</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Bio Preview</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredTeam.map((member, idx) => (
                  <tr key={member.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Order Controls */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono font-bold text-gray-400 w-5">
                          #{member.displayOrder ?? idx + 1}
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(idx, 'up')}
                            className="p-0.5 text-gray-400 hover:text-brand-blue disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === filteredTeam.length - 1}
                            onClick={() => handleMoveOrder(idx, 'down')}
                            className="p-0.5 text-gray-400 hover:text-brand-blue disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Image */}
                    <td className="py-4 px-6">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-gray-200 bg-gray-100 shadow-sm flex-shrink-0">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name & Role */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-brand-dark text-xs sm:text-sm">
                        {member.name}
                      </div>
                      <div className="text-[11px] font-semibold text-brand-blue tracking-wide uppercase mt-0.5">
                        {member.role}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {member.department || 'General'}
                      </span>
                    </td>

                    {/* Bio */}
                    <td className="py-4 px-6 text-xs text-gray-500 max-w-xs truncate">
                      {member.bio || 'No biography entered yet.'}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(member)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                          member.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {member.isPublished ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMember(member);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(member.id, member.name)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-8 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <h3 className="font-heading text-xl uppercase text-brand-dark">
                  {editingMember.id ? 'Edit Team Member' : 'Add New Team Member'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update photo, designation, and biography details stored in Supabase.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMember(null);
                }}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Profile Photo *
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-brand-border bg-gray-50 flex-shrink-0 shadow-inner">
                    {editingMember.imageUrl ? (
                      <Image
                        src={editingMember.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Image URL or upload a file"
                        value={editingMember.imageUrl || ''}
                        onChange={(e) =>
                          setEditingMember({ ...editingMember, imageUrl: e.target.value })
                        }
                        className="flex-grow text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                      />
                      <label className="btn-secondary text-xs px-3.5 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 flex-shrink-0">
                        {uploadingImage ? (
                          <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                        ) : (
                          <Upload className="w-4 h-4 text-brand-blue" />
                        )}
                        <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Square headshots (1:1 aspect ratio) work best. PNG, JPG or WEBP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Davis Jose Abraham"
                    value={editingMember.name || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name: e.target.value })
                    }
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TECHNICAL HEAD"
                    value={editingMember.role || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue uppercase"
                  />
                </div>
              </div>

              {/* Department & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Department / Division
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maritime Systems & Technology"
                    value={editingMember.department || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, department: e.target.value })
                    }
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Display Order (1 = first)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingMember.displayOrder ?? 1}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        displayOrder: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Executive Biography
                </label>
                <textarea
                  rows={3}
                  placeholder="Professional background, responsibilities, and industry background..."
                  value={editingMember.bio || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, bio: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              {/* Editorial Quote */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Personal / Leadership Quote (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Expertise becomes meaningful when it is shared."
                  value={editingMember.quote || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, quote: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue italic"
                />
              </div>

              {/* Contact Info: Email & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="name@afrodreamglobal.com"
                      value={editingMember.email || ''}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, email: e.target.value })
                      }
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. +255 744 555 890"
                      value={editingMember.whatsapp || editingMember.phone || ''}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          whatsapp: e.target.value,
                          phone: e.target.value,
                        })
                      }
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <Linkedin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={editingMember.linkedinUrl || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, linkedinUrl: e.target.value })
                    }
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Status checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheckbox"
                  checked={editingMember.isPublished ?? true}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, isPublished: e.target.checked })
                  }
                  className="w-4 h-4 text-brand-blue rounded border-brand-border focus:ring-brand-blue"
                />
                <label htmlFor="publishedCheckbox" className="text-xs font-medium text-brand-dark cursor-pointer">
                  Publish to website immediately (Home section & /team page)
                </label>
              </div>

              {/* Footer buttons */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMember(null);
                  }}
                  className="btn-secondary text-xs px-5 py-2.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary text-xs px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingMember.id ? 'Save Changes' : 'Create Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
