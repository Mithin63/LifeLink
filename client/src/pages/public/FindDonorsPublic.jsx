import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Navigation,
  Heart,
  Loader2,
  Filter,
  Sparkles,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar.jsx';
import { Footer } from '../../components/Footer.jsx';
import { DonorCard } from '../../components/DonorCard.jsx';
import { ContactDonorModal } from '../../components/ContactDonorModal.jsx';
import { BloodGroupSelector } from '../../components/common/BloodGroupSelector.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input, Select } from '../../components/common/Input.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export const FindDonorsPublic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('blood_group') || '');
  const [locationText, setLocationText] = useState(searchParams.get('city') || '');
  const [availability, setAvailability] = useState('Any');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Selected donor for contact modal
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res = await api.getDonors({
        blood_group: bloodGroup || undefined,
        city: locationText.trim() || undefined,
        available:
          availability === 'Any'
            ? undefined
            : availability === 'Available'
            ? 'true'
            : 'false',
        lat: userCoords?.lat,
        lon: userCoords?.lon,
      });
      if (res.success) {
        setDonors(res.donors || []);
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
      toast.error('Unable to fetch donors from server.', 'Database Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, userCoords]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  // GPS "Use My Current Location" feature
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.warning('Geolocation is not supported by your browser.', 'GPS Unavailable');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        setGpsLoading(false);
        toast.success(
          `Location detected: [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]. Donors sorted by nearest GPS distance!`,
          'GPS Located'
        );
      },
      (error) => {
        setGpsLoading(false);
        console.warn('GPS error:', error);
        toast.info(
          'Location permission was not granted. Please filter by city manually.',
          'Location Note'
        );
      },
      { timeout: 10000 }
    );
  };

  const handleContactClick = (donor) => {
    setSelectedDonor(donor);
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-900 dark:bg-[#080c18] text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-900/40">
              <Sparkles className="w-3.5 h-3.5" /> GPS Donor Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Find Blood Donors
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Connect with verified voluntary donors in your district. Filter by blood group, proximity, and live availability.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Quick Blood Group Filter Pills */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Filter by Blood Group
            </span>
            {bloodGroup && (
              <button
                onClick={() => setBloodGroup('')}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                Clear Group Filter
              </button>
            )}
          </div>
          <BloodGroupSelector
            selected={bloodGroup}
            onChange={setBloodGroup}
            showAll={true}
            allLabel="All Blood Types"
            showDetails={true}
          />
        </div>

        {/* Detailed Search & Location Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
          >
            {/* City / Location Input */}
            <div>
              <Input
                label="City / Location"
                placeholder="e.g., Vijayawada, Guntur"
                icon={MapPin}
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
            </div>

            {/* Availability Filter */}
            <div>
              <Select
                label="Availability Status"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="Any">All Statuses</option>
                <option value="Available">Available Only</option>
                <option value="Unavailable">Unavailable Only</option>
              </Select>
            </div>

            {/* GPS Proximity Locator */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                GPS Geolocation
              </label>
              <Button
                variant={userCoords ? 'success' : 'outline'}
                icon={Navigation}
                onClick={handleUseCurrentLocation}
                isLoading={gpsLoading}
                loadingText="Detecting GPS..."
                className="w-full text-xs"
              >
                {userCoords ? 'GPS Active (Sorted)' : 'Use My GPS Location'}
              </Button>
            </div>

            {/* Submit / Refresh Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                icon={Search}
                isLoading={loading}
                loadingText="Searching..."
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {loading ? (
              <span className="flex items-center gap-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                Finding compatible donors...
              </span>
            ) : (
              <span>
                Found <strong>{donors.length}</strong> {bloodGroup ? `${bloodGroup} ` : ''}
                blood {donors.length === 1 ? 'donor' : 'donors'}
                {locationText ? ` in "${locationText}"` : ''}
              </span>
            )}
          </div>

          <Link to="/emergency-request">
            <Button size="sm" variant="emergency" icon={PlusCircle}>
              Post Emergency Request
            </Button>
          </Link>
        </div>

        {/* Donors Grid with Staggered Animations */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-center mx-auto text-red-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Finding compatible donors in registry...
            </p>
            <p className="text-xs text-slate-400">
              Calculating distance and cross-compatibility
            </p>
          </div>
        ) : donors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor, idx) => (
              <DonorCard
                key={donor.id || donor.user_id || idx}
                donor={donor}
                onContact={handleContactClick}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No compatible donors found"
            description="We could not find active donors matching your current filters. Try selecting 'All Groups', expanding your city search, or creating an emergency blood request."
            actionLabel="Clear Filters"
            onAction={() => {
              setBloodGroup('');
              setLocationText('');
              setAvailability('Any');
              setUserCoords(null);
            }}
            secondaryActionLabel="Post Emergency Request"
            onSecondaryAction={() => {
              window.location.href = '/emergency-request';
            }}
          />
        )}
      </div>

      {/* Contact Donor Modal */}
      {selectedDonor && (
        <ContactDonorModal
          donor={selectedDonor}
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
            setSelectedDonor(null);
          }}
          onSuccess={() => {
            fetchDonors();
          }}
        />
      )}

      <Footer />
    </div>
  );
};
