'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Sponsor {
  id: string;
  name: string;
  imageUrl: string;
  website?: string;
  tier: 'platinum' | 'gold';
  description?: string;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSponsors = async () => {
      try {
        setError(null);
        const response = await fetch('/api/sponsors');
        if (response.ok) {
          const data = await response.json();
          // Transform API data to match component interface
          const transformedSponsors = data.map((sponsor: { id: string; name: string; logoUrl?: string; website?: string; tier: string; description?: string }) => ({
            id: sponsor.id,
            name: sponsor.name,
            imageUrl: sponsor.logoUrl || '/sponsors/placeholder.png',
            website: sponsor.website,
            tier: sponsor.tier.toLowerCase(),
            description: sponsor.description
          }));
          setSponsors(transformedSponsors);
        } else {
          setError('Failed to load sponsors');
          console.error('Failed to load sponsors');
        }
      } catch (error) {
        setError('Error loading sponsors');
        console.error('Error loading sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSponsors();
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier.toUpperCase()) {
      case 'PLATINUM': return 'border-purple-300 bg-purple-50';
      case 'GOLD': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getTierTitle = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase() + ' Sponsor';
  };

  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    const tierKey = sponsor.tier.toLowerCase();
    if (!acc[tierKey]) {
      acc[tierKey] = [];
    }
    acc[tierKey].push(sponsor);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  const tierOrder = ['platinum', 'gold'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
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
          Our Amazing Sponsors
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We are grateful to our sponsors who make this prostate cancer awareness tournament possible. 
          Their support helps us raise funds and awareness for this important cause.
        </p>
      </div>

      {/* Thank You Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl shadow-lg mb-12 text-center border border-green-100">
        <h2 className="text-2xl font-bold text-[#0c372b] mb-4">
          Thank You to Our Sponsors!
        </h2>
        <p className="text-gray-700">
          Without the generous support of our sponsors, this event would not be possible. 
          Every contribution helps us raise awareness about prostate cancer and support the American Cancer Society&apos;s mission.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sponsors by Tier */}
      <div className="space-y-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c372b] mx-auto mb-4"></div>
            <div className="text-gray-500 text-lg">Loading sponsors...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg">Unable to load sponsors</div>
            <p className="text-gray-400 mt-2">Please try again later</p>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No sponsors to display yet.</div>
            <p className="text-gray-400 mt-2">Check back soon for our amazing sponsors!</p>
          </div>
        ) : (
          tierOrder.map((tier) => {
            const tieredSponsors = groupedSponsors[tier];
            if (!tieredSponsors || tieredSponsors.length === 0) return null;

            return (
              <section key={tier}>
                <h2 className="text-3xl font-bold text-center text-[#0c372b] mb-8">
                  {getTierTitle(tier)}
                </h2>
                <div className={`grid gap-8 ${
                  tier === 'platinum' ? 'md:grid-cols-1' : 
                  'md:grid-cols-2'
                }`}>
                  {tieredSponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className={`p-8 rounded-xl shadow-lg text-center transition-transform hover:scale-105 ${getTierColor(tier)} border-2`}
                    >
                      <div className={`mb-6 ${tier === 'platinum' ? 'h-32' : 'h-24'} flex items-center justify-center`}>
                        {sponsor.imageUrl ? (
                          <Image
                            src={sponsor.imageUrl}
                            alt={`${sponsor.name} logo`}
                            width={tier === 'platinum' ? 128 : 96}
                            height={tier === 'platinum' ? 128 : 96}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div className="bg-white p-4 rounded-lg shadow-inner border">
                            <div className="text-4xl text-gray-400">🏢</div>
                          </div>
                        )}
                      </div>
                      <h3 className={`font-bold text-gray-800 mb-4 ${
                        tier === 'platinum' ? 'text-2xl' : 'text-xl'
                      }`}>
                        {sponsor.name}
                      </h3>
                      {sponsor.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {sponsor.description}
                        </p>
                      )}
                      {sponsor.website && (
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-[#0c372b] text-white px-4 py-2 rounded-md hover:bg-[#0a2d22] transition-colors text-sm"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Become a Sponsor Section */}
      <div className="mt-16 bg-[#0c372b] text-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">
          Become a Sponsor
        </h2>
        <p className="text-lg mb-6 text-green-100">
          Interested in supporting our prostate cancer awareness tournament? 
          We offer various sponsorship opportunities to fit different budgets and goals.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-purple-600 bg-opacity-20 p-6 rounded-lg border border-purple-300 text-center">
            <h3 className="font-bold text-purple-200 text-xl mb-2">Platinum Sponsor</h3>
            <p className="text-purple-100 text-2xl font-bold mb-4">$1,000</p>
            <div className="text-purple-100 text-sm space-y-2">
              <div>✅ Tabling at the event</div>
              <div>✅ Logo placement on event shirt back</div>
              <div>✅ Business card at Pickleball HQ for 1 year</div>
            </div>
          </div>
          <div className="bg-yellow-600 bg-opacity-20 p-6 rounded-lg border border-yellow-300 text-center">
            <h3 className="font-bold text-yellow-200 text-xl mb-2">Gold Sponsor</h3>
            <p className="text-yellow-100 text-2xl font-bold mb-4">$500</p>
            <div className="text-yellow-100 text-sm space-y-2">
              <div>✅ Tabling at the event</div>
            </div>
          </div>
        </div>
        <a 
          href="mailto:markrdawod@gmail.com?subject=Sponsorship Inquiry - Pickleball for Prostate Cancer"
          className="inline-block bg-white text-[#0c372b] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Contact Us About Sponsorship
        </a>
      </div>

      {/* Contact Information */}
      <div className="mt-12 text-center bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold text-[#0c372b] mb-2">
          Sponsorship Inquiries
        </h3>
        <p className="text-gray-700">
          For sponsorship opportunities, please contact Mark Dawod at:{' '}
          <a href="mailto:markrdawod@gmail.com" className="text-[#0c372b] font-semibold hover:underline">
            markrdawod@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}