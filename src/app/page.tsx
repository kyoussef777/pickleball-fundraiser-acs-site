'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';

interface Sponsor {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  tier: string;
  description?: string;
}

export default function Home() {
  const [eventSettings, setEventSettings] = useState({
    eventDate: null,
    eventTime: null,
    venue: null,
    venmoHandle: null
  });
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load event settings
        const settingsResponse = await fetch('/api/settings');
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
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
            venmoHandle: settings.venmoHandle || '@EventOrganizer'
          });
        }

        // Load sponsors for the sponsors section
        const sponsorsResponse = await fetch('/api/sponsors');
        if (sponsorsResponse.ok) {
          const sponsorsData = await sponsorsResponse.json();
          setSponsors(sponsorsData.slice(0, 2)); // Show only first 2 sponsors
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        {/* Banner Image */}
        <div className="mb-8">
          <Image
            src="/Pickle_for_prostate_copy.png"
            alt="Pickleball for Prostate Cancer Awareness Banner"
            width={1000}
            height={500}
            className="mx-auto rounded-xl shadow-2xl w-full max-w-4xl h-auto"
            priority
          />
        </div>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl shadow-lg inline-block border border-green-100">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0c372b] mb-4">Event Details</h2>
          <div className="text-xl text-green-800 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span>📅</span>
              <span className="font-semibold">
                {loading ? (
                  <span className="animate-pulse bg-green-200 rounded h-6 w-32 inline-block"></span>
                ) : (
                  eventSettings.eventDate || 'Loading...'
                )}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🕔</span>
              <span className="font-semibold">
                {loading ? (
                  <span className="animate-pulse bg-green-200 rounded h-6 w-28 inline-block"></span>
                ) : (
                  eventSettings.eventTime || 'Loading...'
                )}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>📍</span>
              <span className="font-semibold">
                {loading ? (
                  <span className="animate-pulse bg-green-200 rounded h-6 w-40 inline-block"></span>
                ) : (
                  eventSettings.venue || 'Loading...'
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Prostate Cancer Information */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What is Prostate Cancer?
            </h2>
            <p className="text-gray-600 mb-4">
              Prostate cancer is one of the most common types of cancer in men. The prostate 
              is a small walnut-shaped gland that produces the seminal fluid that nourishes 
              and transports sperm.
            </p>
            <p className="text-gray-600 mb-4">
              Most prostate cancer grows slowly and is initially confined to the prostate 
              gland, where it may not cause serious harm. However, while some types grow 
              slowly and may need minimal or even no treatment, other types are aggressive 
              and can spread quickly.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Awareness Matters
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <p className="text-gray-600">
                  <strong>1 in 8 men</strong> will be diagnosed with prostate cancer in their lifetime
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🎯</span>
                <p className="text-gray-600">
                  Early detection through regular screening can save lives
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">💪</span>
                <p className="text-gray-600">
                  When caught early, prostate cancer has a <strong>nearly 100% survival rate</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Information */}
      <section className="mb-12 bg-green-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          Join Our Pickleball Tournament
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-3">Tournament Format</h3>
            <ul className="space-y-2 text-gray-700">
              <li>🏆 Multiple skill level divisions</li>
              <li>👥 Doubles tournament format</li>
              <li>🏅 Prizes for winners in each division</li>
              <li>🍕 Food and refreshments included</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-3">Requirements to Participate</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ Donation to American Cancer Society (required)</li>
              <li>✅ Complete registration form</li>
              <li>✅ Specify your skill level</li>
              <li>✅ Bring your own paddle (or rent on-site)</li>
              <li>✅ Wear appropriate athletic attire</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="mb-12 bg-gradient-to-r from-gray-50 to-green-50 p-8 rounded-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#0c372b] mb-8">
          Our Amazing Sponsors
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          We&apos;re grateful for our sponsors who make this event possible and support prostate cancer awareness.
        </p>
        
        {/* Featured Sponsors */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {loading ? (
            <div className="col-span-2 text-center py-8">
              <div className="text-gray-500">Loading sponsors...</div>
            </div>
          ) : sponsors.length > 0 ? (
            sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className={`bg-white p-6 rounded-lg shadow-md border-2 text-center ${
                  sponsor.tier === 'PLATINUM'
                    ? 'border-purple-200'
                    : 'border-yellow-200'
                }`}
              >
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    sponsor.tier === 'PLATINUM'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sponsor.tier === 'PLATINUM' ? 'Platinum Partner' : 'Gold Sponsor'}
                  </span>
                </div>
                <div className="h-16 flex items-center justify-center mb-4">
                  {sponsor.logoUrl ? (
                    <Image
                      src={sponsor.logoUrl}
                      alt={`${sponsor.name} logo`}
                      width={64}
                      height={64}
                      className="max-h-16 max-w-16 object-contain"
                    />
                  ) : (
                    <div className="text-4xl">
                      {sponsor.tier === 'PLATINUM' ? '🎗️' : '🏓'}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{sponsor.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {sponsor.description || 
                    (sponsor.tier === 'PLATINUM' 
                      ? 'Thank you for your platinum level support!' 
                      : 'Thank you for your gold level support!'
                    )
                  }
                </p>
                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 bg-[#0c372b] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0a2d22] transition-colors"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <div className="text-gray-500">No sponsors to display yet.</div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/sponsors"
            className="inline-block bg-[#0c372b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0a2d22] transition-colors"
          >
            View All Sponsors
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Sign up for our tournament and help us raise awareness and funds for prostate cancer research.
        </p>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8 rounded max-w-2xl mx-auto">
          <p className="text-yellow-800 font-semibold">
            🏆 Tournament Entry: $50 minimum donation required to play
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            All donations support prostate cancer research through the American Cancer Society
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/donate"
            className="bg-[#0c372b] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#0a2d22] transition-colors"
          >
            Sign Up for Tournament
          </Link>
          <Link 
            href="/volunteer"
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Volunteer to Help
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <p className="text-gray-700 mb-3">
            💡 <strong>Want to support the event without playing?</strong><br />
            You can donate directly to help cover event costs via Venmo:
          </p>
          <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
            <p className="font-bold text-[#0c372b] text-lg">
              Venmo: <span className="font-mono">
                {loading ? (
                  <span className="animate-pulse bg-gray-200 rounded h-5 w-24 inline-block"></span>
                ) : (
                  eventSettings.venmoHandle || 'Loading...'
                )}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Please include &quot;Event Support&quot; in the memo
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
