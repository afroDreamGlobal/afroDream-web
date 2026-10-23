'use client';

import React, { useEffect, useState } from 'react';
import { TradeRoute } from '@/lib/types';
import { Plus, Trash2, Check, EyeOff, Navigation, X, Loader2 } from 'lucide-react';

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<TradeRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [newOriginPort, setNewOriginPort] = useState('Mtwara Port');
  const [newOriginCountry, setNewOriginCountry] = useState('Tanzania');
  const [newDestPort, setNewDestPort] = useState('Tuticorin Port');
  const [newDestCountry, setNewDestCountry] = useState('India');
  const [newTransit, setNewTransit] = useState('14 - 18 Days');
  const [newFreq, setNewFreq] = useState('Weekly scheduled sailings');
  const [isSaving, setIsSaving] = useState(false);

  const fetchRoutes = () => {
    setIsLoading(true);
    fetch('/api/admin/routes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRoutes(data.data);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleToggleActive = async (route: TradeRoute) => {
    const updated = { ...route, isActive: !route.isActive };
    await fetch('/api/admin/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    fetchRoutes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trade route?')) return;
    await fetch(`/api/admin/routes?id=${id}`, { method: 'DELETE' });
    fetchRoutes();
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName) return;

    setIsSaving(true);
    const payload = {
      name: newRouteName,
      originRegion: 'Africa',
      originCountry: newOriginCountry,
      originPort: newOriginPort,
      destinationRegion: 'Asia',
      destinationCountry: newDestCountry,
      destinationPort: newDestPort,
      transitTime: newTransit,
      frequency: newFreq,
      cargoTypes: ['Raw Cashew Nuts', 'Commercial Freight'],
      isActive: true,
      isFeatured: true,
    };

    try {
      const res = await fetch('/api/admin/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewRouteName('');
        fetchRoutes();
      }
    } catch (err) {
      alert('Error creating route');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading uppercase text-brand-dark tracking-wide">
            TRADE ROUTES & DESTINATION PORTS
          </h1>
          <p className="text-xs text-brand-muted">
            Configure origin terminals, discharge ports, and transit schedules.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trade Route</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-brand-border">
              <tr>
                <th className="py-3.5 px-6">Route Name</th>
                <th className="py-3.5 px-6">Origin Port</th>
                <th className="py-3.5 px-6">Destination Port</th>
                <th className="py-3.5 px-6">Transit Time</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-brand-dark text-xs">{route.name}</td>
                  <td className="py-4 px-6 text-xs text-gray-700">
                    {route.originPort}, {route.originCountry}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-700">
                    {route.destinationPort}, {route.destinationCountry}
                  </td>
                  <td className="py-4 px-6 text-xs text-brand-blue font-semibold">
                    {route.transitTime}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleActive(route)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                        route.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {route.isActive ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 my-8 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <h3 className="font-heading text-xl uppercase text-brand-dark">Add Trade Route</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Corridor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanzania to South India (Tuticorin)"
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Origin Port
                  </label>
                  <input
                    type="text"
                    value={newOriginPort}
                    onChange={(e) => setNewOriginPort(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Origin Country
                  </label>
                  <input
                    type="text"
                    value={newOriginCountry}
                    onChange={(e) => setNewOriginCountry(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Destination Port
                  </label>
                  <input
                    type="text"
                    value={newDestPort}
                    onChange={(e) => setNewDestPort(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Destination Country
                  </label>
                  <input
                    type="text"
                    value={newDestCountry}
                    onChange={(e) => setNewDestCountry(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Average Transit Time
                  </label>
                  <input
                    type="text"
                    value={newTransit}
                    onChange={(e) => setNewTransit(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Sailing Frequency
                  </label>
                  <input
                    type="text"
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary text-xs px-6 py-2 rounded-lg font-semibold flex items-center space-x-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Route</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
