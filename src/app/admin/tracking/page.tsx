'use client';

import React, { useEffect, useState } from 'react';
import { Shipment, TrackingEvent, ShipmentStatus } from '@/lib/types';
import { Ship, Plus, MapPin, Calendar, CheckCircle2, Clock, X, Loader2 } from 'lucide-react';

export default function AdminTrackingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventStatus, setNewEventStatus] = useState<ShipmentStatus>('in_transit');
  const [isSaving, setIsSaving] = useState(false);

  // New Shipment form state
  const [newTrackingNum, setNewTrackingNum] = useState('');
  const [newBookingRef, setNewBookingRef] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newOrigin, setNewOrigin] = useState('Mtwara Port, Tanzania');
  const [newDest, setNewDest] = useState('Tuticorin Port, India');
  const [newVessel, setNewVessel] = useState('');
  const [newVoyage, setNewVoyage] = useState('');

  const fetchShipments = () => {
    setIsLoading(true);
    fetch('/api/admin/tracking')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setShipments(data.data);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment || !newEventLocation || !newEventDesc) return;

    setIsSaving(true);
    const newEvent: TrackingEvent = {
      id: `ev-${Date.now()}`,
      shipmentId: selectedShipment.id,
      status: newEventStatus,
      statusLabel: newEventStatus.replace('_', ' ').toUpperCase(),
      location: newEventLocation,
      description: newEventDesc,
      timestamp: new Date().toISOString(),
    };

    const updatedShipment = {
      ...selectedShipment,
      status: newEventStatus,
      events: [...selectedShipment.events, newEvent],
    };

    try {
      const res = await fetch('/api/admin/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedShipment),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedShipment(data.data);
        setNewEventLocation('');
        setNewEventDesc('');
        fetchShipments();
      }
    } catch (err) {
      alert('Error updating shipment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackingNum || !newCustomer) return;

    setIsSaving(true);
    const newShipmentPayload = {
      trackingNumber: newTrackingNum,
      bookingReference: newBookingRef || `BK-${Date.now()}`,
      customerName: newCustomer,
      origin: newOrigin,
      destination: newDest,
      serviceType: 'Container Shipment',
      cargoDescription: 'Raw Cashew Nuts',
      status: 'registered' as ShipmentStatus,
      vesselName: newVessel,
      voyageNumber: newVoyage,
      events: [
        {
          id: `ev-${Date.now()}`,
          shipmentId: `shp-${Date.now()}`,
          status: 'registered' as ShipmentStatus,
          statusLabel: 'Shipment Registered',
          location: newOrigin,
          description: 'Shipment registered and container release authorized.',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      const res = await fetch('/api/admin/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShipmentPayload),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewTrackingNum('');
        setNewBookingRef('');
        setNewCustomer('');
        fetchShipments();
      }
    } catch (err) {
      alert('Error creating shipment');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading uppercase text-brand-dark tracking-wide">
            SHIPMENTS & CARGO TRACKING
          </h1>
          <p className="text-xs text-brand-muted">
            Track container voyages, assign vessel information, and append real-time terminal milestones.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary text-xs px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Shipment Record</span>
        </button>
      </div>

      {/* Shipments List */}
      <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-brand-border">
              <tr>
                <th className="py-3.5 px-6">Tracking #</th>
                <th className="py-3.5 px-6">Booking Ref</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Vessel & Voyage</th>
                <th className="py-3.5 px-6">Route</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {shipments.map((shp) => (
                <tr
                  key={shp.id}
                  onClick={() => setSelectedShipment(shp)}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-bold text-brand-blue text-xs">
                    {shp.trackingNumber}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-700">{shp.bookingReference}</td>
                  <td className="py-4 px-6 text-xs text-brand-dark font-semibold">
                    {shp.customerName}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600">
                    {shp.vesselName || 'Pending'} {shp.voyageNumber ? `(${shp.voyageNumber})` : ''}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600">
                    {shp.origin} &rarr; {shp.destination}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border bg-blue-50 text-blue-700 border-blue-200">
                      {shp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-xs font-semibold text-brand-blue hover:underline">
                      Add Event
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Milestones Detail Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block">
                  Cargo Tracking Details
                </span>
                <h3 className="font-heading text-2xl uppercase text-brand-dark">
                  {selectedShipment.trackingNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Events Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
                Recorded Milestones ({selectedShipment.events.length})
              </h4>
              <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
                {selectedShipment.events.map((ev, idx) => (
                  <div key={idx} className="p-3 bg-brand-bg rounded-lg border border-brand-border text-xs">
                    <div className="flex justify-between items-center font-bold text-brand-dark">
                      <span>{ev.statusLabel}</span>
                      <span className="text-brand-muted font-normal text-[11px]">
                        {new Date(ev.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-brand-blue font-semibold mt-0.5">{ev.location}</div>
                    <p className="text-gray-600 mt-1">{ev.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Milestone Event Form */}
            <form onSubmit={handleAddMilestone} className="space-y-4 pt-4 border-t border-brand-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                Append New Transit Event
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Event Status
                  </label>
                  <select
                    value={newEventStatus}
                    onChange={(e) => setNewEventStatus(e.target.value as ShipmentStatus)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:border-brand-blue"
                  >
                    <option value="registered">Registered</option>
                    <option value="processing">Processing & Customs</option>
                    <option value="in_transit">In Transit (Maritime)</option>
                    <option value="arrived_pod">Arrived at POD</option>
                    <option value="customs_clearance">Customs Clearance</option>
                    <option value="delivered">Delivered to Factory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Current Location / Terminal
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tuticorin Port Anchorage"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Milestone Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Discharging cargo from container vessel onto terminal yard..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedShipment(null)}
                  className="btn-secondary text-xs px-5 py-2 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary text-xs px-6 py-2 rounded-lg font-semibold flex items-center space-x-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Append Milestone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Shipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 my-8 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <h3 className="font-heading text-xl uppercase text-brand-dark">
                Create New Shipment Record
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ADG900123"
                    value={newTrackingNum}
                    onChange={(e) => setNewTrackingNum(e.target.value.toUpperCase())}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Booking Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BK-2026-90"
                    value={newBookingRef}
                    onChange={(e) => setNewBookingRef(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Customer / Consignee Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Global Cashew Importers Ltd"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Origin Port
                  </label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Destination Port
                  </label>
                  <input
                    type="text"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Vessel Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MV AFRICAN STAR"
                    value={newVessel}
                    onChange={(e) => setNewVessel(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Voyage #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AS-2611"
                    value={newVoyage}
                    onChange={(e) => setNewVoyage(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  <span>Register Shipment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
