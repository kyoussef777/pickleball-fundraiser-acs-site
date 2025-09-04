'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skillLevel: string;
  dietaryRestrictions: string;
}

export default function DonatePage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    skillLevel: '',
    dietaryRestrictions: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [eventSettings, setEventSettings] = useState({
    eventDate: null as string | null,
    eventTime: null as string | null,
    venue: null as string | null,
    venmoHandle: null as string | null,
    acsLink: null as string | null
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    const loadEventSettings = async () => {
      try {
        setSettingsLoading(true);
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          // Parse date without timezone conversion
          const dateParts = settings.eventDate.split('-');
          const eventDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
          
          setEventSettings({
            eventDate: eventDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            eventTime: settings.eventTime,
            venue: settings.venue,
            venmoHandle: settings.venmoHandle || '@EventOrganizer',
            acsLink: settings.acsLink || 'https://www.cancer.org/involved/donate.html'
          });
        }
      } catch (error) {
        console.error('Failed to load event settings:', error);
      } finally {
        setSettingsLoading(false);
      }
    };

    loadEventSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save participant to database
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Show donation modal instead of immediate redirect
        setShowDonationModal(true);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          skillLevel: '',
          dietaryRestrictions: ''
        });
      } else {
        const error = await response.json();
        alert(`Registration failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonateACS = () => {
    const acsLink = eventSettings.acsLink || 'https://www.cancer.org/involved/donate.html';
    window.open(acsLink, '_blank');
    setShowDonationModal(false);
  };

  const handleDonateVenmo = () => {
    // Create Venmo deep link - removes @ symbol if present
    const venmoHandle = eventSettings.venmoHandle?.replace('@', '') || 'EventOrganizer';
    const venmoUrl = `https://venmo.com/${venmoHandle}?txn=pay&note=Tournament%20Donation`;
    window.open(venmoUrl, '_blank');
    setShowDonationModal(false);
  };

  const handleCloseModal = () => {
    setShowDonationModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image
            src="/Pickle_for_prostate.png"
            alt="Pickleball for Prostate Cancer Logo"
            width={80}
            height={80}
            className="rounded-lg"
          />
        </div>
        <h1 className="text-4xl font-bold text-[#0c372b] mb-4">
          Tournament Registration & Donation
        </h1>
        <p className="text-lg text-gray-600">
          Complete your information below, then donate to the American Cancer Society to secure your spot!
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-green-50 border-l-4 border-[#0c372b] p-6 mb-8">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-lg font-medium text-[#0c372b]">
              Tournament Registration Requirements
            </h3>
            <div className="mt-2 text-green-700">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-3 rounded">
                <p className="font-semibold text-yellow-800">
                  ⚠️ Minimum $50 donation required to play in the tournament
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Donations under $50 are greatly appreciated but do not qualify for tournament play
                </p>
              </div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Fill out the registration form below</li>
                <li>Submit the form to proceed to donation</li>
                <li>Complete your $50+ donation to the American Cancer Society</li>
                <li>Your tournament registration will be confirmed upon donation</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
            />
          </div>

          {/* Skill Level */}
          <div className="md:col-span-2">
            <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Pickleball Skill Level *
            </label>
            <select
              id="skillLevel"
              name="skillLevel"
              required
              value={formData.skillLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
            >
              <option value="">Select your skill level</option>
              <option value="beginner">Beginner (1.0 - 2.5)</option>
              <option value="intermediate">Intermediate (3.0 - 3.5)</option>
              <option value="advanced">Advanced (4.0 - 4.5)</option>
              <option value="expert">Expert (5.0+)</option>
              <option value="first-time">First time playing</option>
            </select>
          </div>

          {/* Dietary Restrictions */}
          <div className="md:col-span-2">
            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Restrictions or Allergies (Optional)
            </label>
            <textarea
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              rows={3}
              value={formData.dietaryRestrictions}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
              placeholder="Please list any dietary restrictions or food allergies..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0c372b] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#0a2d22] focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Processing...' : 'Complete Registration & Proceed to Donation'}
          </button>
        </div>
      </form>

      {/* Alternative Support Option */}
      <div className="mt-12 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">
          Support Our Event Directly
        </h3>
        <p className="text-yellow-700 mb-4">
          Want to help support the event costs (venue, equipment, refreshments) in addition to your ACS donation? 
          You can send a contribution via Venmo to help make this event successful!
        </p>
        <div className="bg-white p-4 rounded border-l-4 border-yellow-400">
          <p className="font-medium text-gray-800">
            Venmo: <span className="text-[#0c372b]">
              {settingsLoading ? (
                <span className="animate-pulse bg-gray-200 rounded h-5 w-24 inline-block"></span>
              ) : (
                eventSettings.venmoHandle || 'Loading...'
              )}
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Please include &quot;Pickleball Event&quot; in the memo
          </p>
        </div>
      </div>

      {/* Event Reminder */}
      <div className="mt-8 text-center bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Event Reminder
        </h3>
        <p className="text-green-700">
          📅 {settingsLoading ? (
            <span className="animate-pulse bg-green-200 rounded h-5 w-32 inline-block"></span>
          ) : (
            eventSettings.eventDate || 'Loading...'
          )} | 🕔 {settingsLoading ? (
            <span className="animate-pulse bg-green-200 rounded h-5 w-28 inline-block"></span>
          ) : (
            eventSettings.eventTime || 'Loading...'
          )} | 📍 {settingsLoading ? (
            <span className="animate-pulse bg-green-200 rounded h-5 w-40 inline-block"></span>
          ) : (
            eventSettings.venue || 'Loading...'
          )}
        </p>
        <p className="text-sm text-green-600 mt-2">
          You&apos;ll receive a confirmation email with additional details after your donation is complete.
        </p>
      </div>

      {/* Donation Options Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-4 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/Pickle_for_prostate.png"
                  alt="Pickleball for Prostate Cancer Logo"
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-2xl font-bold text-[#0c372b] mb-2">
                Registration Successful! 🎉
              </h2>
              <p className="text-gray-600">
                Thank you for signing up for our tournament! Now complete your registration with a donation.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <h3 className="font-semibold text-red-800 mb-2">🏓 Tournament Entry: $50 Minimum Required</h3>
                <p className="text-sm text-red-700">
                  This minimum donation is required to play in the tournament. Lesser amounts are appreciated but don&apos;t qualify for tournament play.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Alternative: Venmo Option</h3>
                <p className="text-sm text-blue-700 mb-2">
                  You can also send your donation via Venmo to:
                </p>
                <p className="font-mono font-bold text-blue-800 bg-white px-2 py-1 rounded border inline-block">
                  {settingsLoading ? (
                    <span className="animate-pulse bg-gray-200 rounded h-5 w-24 inline-block"></span>
                  ) : (
                    eventSettings.venmoHandle || 'Loading...'
                  )}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Please include &quot;Tournament Donation&quot; in the memo
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDonateACS}
                className="flex-1 bg-[#0c372b] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#0a2d22] transition-colors text-center"
              >
                Donate via American Cancer Society →
              </button>
              <button
                onClick={handleDonateVenmo}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                I&apos;ll Use Venmo
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your tournament spot is reserved. Complete your donation to finalize registration.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}