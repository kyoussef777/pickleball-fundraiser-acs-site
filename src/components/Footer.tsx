'use client';

import { useState, useEffect } from 'react';

interface EventSettings {
  eventDate: string;
  eventTime: string;
  venue: string;
}

export default function Footer() {
  const [eventSettings, setEventSettings] = useState<EventSettings>({
    eventDate: 'September 27th, 2024',
    eventTime: '5:00 PM - 10:00 PM',
    venue: 'Pickleball HQ, NJ'
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
        console.error('Failed to load event settings in footer:', error);
      }
    };

    loadEventSettings();
  }, []);

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Details</h3>
            <p className="text-gray-300">
              {eventSettings.eventDate}<br />
              {eventSettings.eventTime}<br />
              {eventSettings.venue}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Partners</h3>
            <p className="text-gray-300">
              American Cancer Society<br />
              Prostate Cancer Awareness
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Questions? Contact Mark Dawod<br />
              <a href="mailto:markrdawod@gmail.com" className="text-green-300 hover:text-white transition-colors">
                markrdawod@gmail.com
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Pickleball for Prostate Cancer Awareness</p>
        </div>
      </div>
    </footer>
  );
}