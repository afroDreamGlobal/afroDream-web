'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X, Upload, Loader2 } from 'lucide-react';
import { Service } from '@/lib/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchServices = () => {
    setIsLoading(true);
    fetch('/api/admin/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.data);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleTogglePublish = async (service: Service) => {
    const updated = { ...service, isPublished: !service.isPublished };
    await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
    fetchServices();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;

    await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingService),
    });

    setIsModalOpen(false);
    setEditingService(null);
    fetchServices();
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
        setEditingService((prev) => ({
          ...prev,
          imageUrl: data.data.secure_url,
        }));
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading uppercase text-brand-dark tracking-wide">
            SERVICE MANAGEMENT
          </h1>
          <p className="text-xs text-brand-muted">
            Add, update, or publish corporate services directly to the live website.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingService({
              title: '',
              category: 'Ocean Freight',
              shortDescription: '',
              fullDescription: '',
              imageUrl:
                'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
              features: ['Full port and inland execution', 'Customs documentation support'],
              isPublished: true,
            });
            setIsModalOpen(true);
          }}
          className="btn-primary text-xs px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-brand-border">
              <tr>
                <th className="py-3.5 px-6">Image</th>
                <th className="py-3.5 px-6">Title & Category</th>
                <th className="py-3.5 px-6">Short Description</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-14 h-10 rounded-lg overflow-hidden relative border border-gray-200">
                      <Image
                        src={service.imageUrl}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-brand-dark text-xs">{service.title}</div>
                    <div className="text-[11px] text-brand-blue font-medium mt-0.5">
                      {service.category}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600 max-w-md line-clamp-2">
                    {service.shortDescription}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleTogglePublish(service)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                        service.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {service.isPublished ? (
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
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Service"
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

      {/* Edit / Create Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-8 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <h3 className="font-heading text-xl uppercase text-brand-dark">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingService.category || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, category: e.target.value })
                    }
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Route Highlight
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mtwara Port to Tuticorin"
                    value={editingService.routeHighlight || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, routeHighlight: e.target.value })
                    }
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Short Description (Homepage Card & Timeline) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDescription || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, shortDescription: e.target.value })
                  }
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Full Service Description (Detail Page)
                </label>
                <textarea
                  rows={4}
                  value={editingService.fullDescription || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, fullDescription: e.target.value })
                  }
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Service Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingService.imageUrl || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, imageUrl: e.target.value })
                    }
                    className="flex-grow text-sm px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                  <label className="btn-secondary text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 flex-shrink-0">
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
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs px-5 py-2.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-6 py-2.5 rounded-lg font-semibold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
