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
  const [eventSettings, setEventSettings] = useState({
    eventDate: 'September 27th, 2024',
    eventTime: '5:00 PM - 10:00 PM',
    venue: 'Pickleball HQ, New Jersey',
    venmoHandle: '@EventOrganizer'
  });

  // In a real app, this would fetch from your API/database
  useEffect(() => {
    // For now, we'll use localStorage to simulate getting data from admin panel
    const savedSettings = localStorage.getItem('eventSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setEventSettings({
        eventDate: new Date(settings.eventDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        eventTime: settings.eventTime,
        venue: settings.venue,
        venmoHandle: settings.venmoHandle || '@EventOrganizer'
      });
    }
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

    // Simulate form processing
    setTimeout(() => {
      // Redirect to ACS donation page
      window.open('https://www.cancer.org/involved/donate.html', '_blank');
      alert('Thank you for signing up! Please complete your donation to the American Cancer Society in the new tab, then return here for confirmation.');
      setIsSubmitting(false);
    }, 1000);
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
              Registration Process
            </h3>
            <div className="mt-2 text-green-700">
              <ol className="list-decimal list-inside space-y-1">
                <li>Fill out the registration form below</li>
                <li>Submit the form to proceed to donation</li>
                <li>Complete your donation to the American Cancer Society</li>
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
            Venmo: <span className="text-[#0c372b]">{eventSettings.venmoHandle}</span>
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
          📅 {eventSettings.eventDate} | 🕔 {eventSettings.eventTime} | 📍 {eventSettings.venue}
        </p>
        <p className="text-sm text-green-600 mt-2">
          You&apos;ll receive a confirmation email with additional details after your donation is complete.
        </p>
      </div>
    </div>
  );
}