'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  availability: string[];
  roles: string[];
  experience: string;
  emergencyContact: string;
  emergencyPhone: string;
  additionalInfo: string;
}

export default function VolunteerPage() {
  const [formData, setFormData] = useState<VolunteerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    availability: [],
    roles: [],
    experience: '',
    emergencyContact: '',
    emergencyPhone: '',
    additionalInfo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventSettings, setEventSettings] = useState({
    eventDate: 'September 27th, 2024',
    eventTime: '5:00 PM - 10:00 PM',
    venue: 'Pickleball HQ, New Jersey'
  });

  useEffect(() => {
    const loadEventSettings = async () => {
      try {
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
            venue: settings.venue
          });
        }
      } catch (error) {
        console.error('Failed to load event settings:', error);
      }
    };

    loadEventSettings();
  }, []);

  const timeSlots = [
    '5:00 PM - 7:30 PM (Tournament & Setup)',
    '7:30 PM - 10:00 PM (Tournament & Cleanup)'
  ];

  const volunteerRoles = [
    'Tournament Referee/Official',
    'Registration & Check-in',
    'Setup & Equipment Management',
    'Food & Refreshment Service',
    'Scorekeeping',
    'Crowd Management',
    'Photography/Social Media',
    'Cleanup Crew',
    'General Support'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name as keyof Pick<VolunteerFormData, 'availability' | 'roles'>], value]
        : prev[name as keyof Pick<VolunteerFormData, 'availability' | 'roles'>].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save volunteer to database
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Thank you for volunteering! We will contact you soon with more details about your volunteer role.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          availability: [],
          roles: [],
          experience: '',
          emergencyContact: '',
          emergencyPhone: '',
          additionalInfo: ''
        });
      } else {
        const error = await response.json();
        alert(`Volunteer registration failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Volunteer registration error:', error);
      alert('Volunteer registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          Volunteer for Our Tournament
        </h1>
        <p className="text-lg text-gray-600">
          Help make our prostate cancer awareness tournament a success!
        </p>
      </div>

      {/* Volunteer Benefits */}
      <div className="bg-green-50 border-l-4 border-[#0c372b] p-6 mb-8">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-lg font-medium text-[#0c372b]">
              Why Volunteer With Us?
            </h3>
            <div className="mt-2 text-green-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Support a meaningful cause - prostate cancer awareness</li>
                <li>Meet fellow community members who care about health advocacy</li>
                <li>Gain experience in event management and sports officiating</li>
                <li>Receive a volunteer appreciation gift</li>
                <li>Enjoy free food and refreshments during your volunteer shift</li>
                <li>Community service hours for students</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Volunteer Registration</h2>
        
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

          {/* Emergency Contact */}
          <div>
            <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Name *
            </label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              required
              value={formData.emergencyContact}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Phone *
            </label>
            <input
              type="tel"
              id="emergencyPhone"
              name="emergencyPhone"
              required
              value={formData.emergencyPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
            />
          </div>
        </div>

        {/* Availability */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Available Time Slots * (Select all that apply)
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <label key={slot} className="flex items-center">
                <input
                  type="checkbox"
                  name="availability"
                  value={slot}
                  checked={formData.availability.includes(slot)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#0c372b] focus:ring-[#0c372b] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{slot}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Volunteer Roles */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Volunteer Roles * (Select all that interest you)
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {volunteerRoles.map((role) => (
              <label key={role} className="flex items-center">
                <input
                  type="checkbox"
                  name="roles"
                  value={role}
                  checked={formData.roles.includes(role)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#0c372b] focus:ring-[#0c372b] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mt-6">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
            Relevant Experience (Optional)
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select your experience level</option>
            <option value="none">No prior volunteering experience</option>
            <option value="some">Some volunteer experience</option>
            <option value="sports">Sports event volunteering experience</option>
            <option value="referee">Pickleball/sports officiating experience</option>
            <option value="event">Event management experience</option>
            <option value="professional">Professional event/sports background</option>
          </select>
        </div>

        {/* Additional Information */}
        <div className="mt-6">
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Information (Optional)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            rows={4}
            value={formData.additionalInfo}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Tell us anything else we should know, special skills, physical limitations, questions, etc."
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting || formData.availability.length === 0 || formData.roles.length === 0}
            className="w-full bg-[#0c372b] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#0a2d22] focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Volunteer Application'}
          </button>
        </div>
      </form>

      {/* Important Notes */}
      <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold text-[#0c372b] mb-4">
          Important Notes for Volunteers
        </h3>
        <ul className="text-green-700 space-y-2 text-sm">
          <li>• Please arrive 15 minutes before your scheduled volunteer time</li>
          <li>• Wear comfortable clothing and closed-toe shoes</li>
          <li>• Volunteer t-shirts will be provided at the event</li>
          <li>• Parking will be available at the venue</li>
          <li>• We&apos;ll send you detailed instructions and contact information before the event</li>
          <li>• Questions? Contact Mark Dawod at <a href="mailto:markrdawod@gmail.com" className="text-[#0c372b] font-semibold hover:underline">markrdawod@gmail.com</a></li>
        </ul>
      </div>

      {/* Event Reminder */}
      <div className="mt-8 text-center bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-[#0c372b] mb-2">
          Event Details
        </h3>
        <p className="text-green-700">
          📅 {eventSettings.eventDate} | 📍 {eventSettings.venue}
        </p>
        <p className="text-sm text-green-600 mt-2">
          Thank you for supporting prostate cancer awareness!
        </p>
      </div>
    </div>
  );
}