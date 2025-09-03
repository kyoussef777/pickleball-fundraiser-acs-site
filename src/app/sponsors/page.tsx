'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Sponsor {
  id: string;
  name: string;
  imageUrl: string;
  website?: string;
  tier: 'platinum' | 'gold';
}

export default function SponsorsPage() {
  // Mock sponsors data - in real app, this would come from database/API
  const [sponsors] = useState<Sponsor[]>([
    {
      id: '1',
      name: 'American Cancer Society',
      imageUrl: '/sponsors/acs-logo.png', // Would be uploaded via admin
      website: 'https://www.cancer.org',
      tier: 'platinum'
    },
    {
      id: '2',
      name: 'Pickleball HQ',
      imageUrl: '/sponsors/pickleball-hq.png',
      website: 'https://pickleballhq.com',
      tier: 'gold'
    }
  ]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'border-purple-300 bg-purple-50';
      case 'gold': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getTierTitle = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1) + ' Sponsor';
  };

  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    if (!acc[sponsor.tier]) {
      acc[sponsor.tier] = [];
    }
    acc[sponsor.tier].push(sponsor);
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

      {/* Sponsors by Tier */}
      <div className="space-y-12">
        {tierOrder.map((tier) => {
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
                    <div className={`mb-6 ${tier === 'platinum' ? 'h-32' : tier === 'gold' ? 'h-24' : 'h-20'} flex items-center justify-center`}>
                      {/* Placeholder for sponsor logo */}
                      <div className="bg-white p-4 rounded-lg shadow-inner border">
                        <div className="text-4xl text-gray-400">🏢</div>
                      </div>
                    </div>
                    <h3 className={`font-bold text-gray-800 mb-4 ${
                      tier === 'platinum' ? 'text-2xl' : 
                      tier === 'gold' ? 'text-xl' : 
                      'text-lg'
                    }`}>
                      {sponsor.name}
                    </h3>
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
        })}
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