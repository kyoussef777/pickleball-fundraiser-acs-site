'use client';

import { useState, useEffect } from 'react';

interface EventSettings {
  eventDate: string | null;
  eventTime: string | null;
  venue: string | null;
}

export default function Footer() {
  const [eventSettings, setEventSettings] = useState<EventSettings>({
    eventDate: null,
    eventTime: null,
    venue: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventSettings = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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
              {loading ? (
                <>
                  <span className="animate-pulse bg-gray-600 rounded h-4 w-32 inline-block"></span><br />
                  <span className="animate-pulse bg-gray-600 rounded h-4 w-28 inline-block"></span><br />
                  <span className="animate-pulse bg-gray-600 rounded h-4 w-36 inline-block"></span>
                </>
              ) : (
                <>
                  {eventSettings.eventDate || 'Loading...'}<br />
                  {eventSettings.eventTime || 'Loading...'}<br />
                  {eventSettings.venue || 'Loading...'}
                </>
              )}
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