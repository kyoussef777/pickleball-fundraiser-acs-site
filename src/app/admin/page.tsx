'use client';

import { useState } from 'react';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skillLevel: string;
  registrationDate: string;
  donationCompleted: boolean;
}

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  availability: string[];
  roles: string[];
  registrationDate: string;
}

interface EventSettings {
  eventDate: string;
  eventTime: string;
  venue: string;
  acsLink: string;
  venmoHandle: string;
  maxParticipants: number;
  registrationOpen: boolean;
}

interface Sponsor {
  id: string;
  name: string;
  imageUrl: string;
  website?: string;
  tier: 'platinum' | 'gold';
  dateAdded: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('participants');
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    website: '',
    tier: 'gold' as const,
    imageFile: null as File | null
  });
  
  // Mock data - in a real app, this would come from a database
  const [participants] = useState<Participant[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      skillLevel: 'intermediate',
      registrationDate: '2024-09-01',
      donationCompleted: true
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '(555) 987-6543',
      skillLevel: 'beginner',
      registrationDate: '2024-09-02',
      donationCompleted: false
    }
  ]);

  const [volunteers] = useState<Volunteer[]>([
    {
      id: '1',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@email.com',
      phone: '(555) 456-7890',
      availability: ['5:00 PM - 7:30 PM (Tournament & Setup)', '7:30 PM - 10:00 PM (Tournament & Cleanup)'],
      roles: ['Tournament Referee/Official', 'Scorekeeping'],
      registrationDate: '2024-09-01'
    }
  ]);

  const [sponsors, setSponsors] = useState<Sponsor[]>([
    {
      id: '1',
      name: 'American Cancer Society',
      imageUrl: '/sponsors/acs-logo.png',
      website: 'https://www.cancer.org',
      tier: 'platinum',
      dateAdded: '2024-09-01'
    },
    {
      id: '2',
      name: 'Pickleball HQ',
      imageUrl: '/sponsors/pickleball-hq.png',
      website: 'https://pickleballhq.com',
      tier: 'gold',
      dateAdded: '2024-09-02'
    }
  ]);

  const [eventSettings, setEventSettings] = useState<EventSettings>({
    eventDate: '2024-09-27',
    eventTime: '5:00 PM - 10:00 PM',
    venue: 'Pickleball HQ, New Jersey',
    acsLink: 'https://www.cancer.org/involved/donate.html',
    venmoHandle: '@EventOrganizer',
    maxParticipants: 64,
    registrationOpen: true
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in production, use proper auth
    if (username === 'admin' && password === 'pickleballadmin2024') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage (in real app, would save to database)
    localStorage.setItem('eventSettings', JSON.stringify(eventSettings));
    alert('Event settings updated successfully! Changes will appear on other pages.');
  };

  const handleAddSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsor.name) {
      alert('Please enter sponsor name');
      return;
    }
    
    const sponsor: Sponsor = {
      id: Date.now().toString(),
      name: newSponsor.name,
      website: newSponsor.website,
      tier: newSponsor.tier,
      imageUrl: '/sponsors/placeholder.png', // In real app, would upload image
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setSponsors([...sponsors, sponsor]);
    setNewSponsor({ name: '', website: '', tier: 'gold', imageFile: null });
    alert('Sponsor added successfully!');
  };

  const handleRemoveSponsor = (sponsorId: string) => {
    if (confirm('Are you sure you want to remove this sponsor?')) {
      setSponsors(sponsors.filter(s => s.id !== sponsorId));
    }
  };

  const exportParticipants = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Skill Level', 'Registration Date', 'Donation Status'].join(','),
      ...participants.map(p => [
        `"${p.firstName} ${p.lastName}"`,
        p.email,
        p.phone,
        p.skillLevel,
        p.registrationDate,
        p.donationCompleted ? 'Completed' : 'Pending'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'tournament_participants.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportVolunteers = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Availability', 'Roles', 'Registration Date'].join(','),
      ...volunteers.map(v => [
        `"${v.firstName} ${v.lastName}"`,
        v.email,
        v.phone,
        `"${v.availability.join('; ')}"`,
        `"${v.roles.join('; ')}"`,
        v.registrationDate
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'tournament_volunteers.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0c372b] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#0a2d22] focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:ring-offset-2 transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: admin</p>
            <p>Password: pickleballadmin2024</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Event Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'participants', label: 'Participants', count: participants.length },
            { id: 'volunteers', label: 'Volunteers', count: volunteers.length },
            { id: 'sponsors', label: 'Sponsors', count: sponsors.length },
            { id: 'settings', label: 'Settings', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#0c372b] text-[#0c372b]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Tournament Participants</h2>
            <button
              onClick={exportParticipants}
              className="bg-[#0c372b] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#0a2d22] transition-colors"
            >
              Export CSV
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skill Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donation Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.map((participant) => (
                  <tr key={participant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{participant.email}</div>
                      <div className="text-sm text-gray-500">{participant.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {participant.skillLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(participant.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        participant.donationCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {participant.donationCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Volunteers Tab */}
      {activeTab === 'volunteers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Event Volunteers</h2>
            <button
              onClick={exportVolunteers}
              className="bg-[#0c372b] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#0a2d22] transition-colors"
            >
              Export CSV
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferred Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {volunteer.firstName} {volunteer.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{volunteer.email}</div>
                      <div className="text-sm text-gray-500">{volunteer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {volunteer.availability.map((slot, index) => (
                          <div key={index} className="mb-1">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {slot}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {volunteer.roles.map((role, index) => (
                          <div key={index} className="mb-1">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(volunteer.registrationDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sponsors Tab */}
      {activeTab === 'sponsors' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Sponsor Management</h2>
          </div>
          
          {/* Add New Sponsor Form */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Sponsor</h3>
            <form onSubmit={handleAddSponsor}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSponsor.name}
                    onChange={(e) => setNewSponsor({...newSponsor, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newSponsor.website}
                    onChange={(e) => setNewSponsor({...newSponsor, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsorship Tier
                  </label>
                  <select
                    value={newSponsor.tier}
                    onChange={(e) => setNewSponsor({...newSponsor, tier: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                  >
                    <option value="gold">Gold ($500)</option>
                    <option value="platinum">Platinum ($1,000)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewSponsor({...newSponsor, imageFile: e.target.files?.[0] || null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, or SVG (max 2MB)</p>
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#0c372b] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#0a2d22] transition-colors"
              >
                Add Sponsor
              </button>
            </form>
          </div>

          {/* Existing Sponsors List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sponsor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sponsors.map((sponsor) => (
                  <tr key={sponsor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sponsor.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sponsor.tier === 'platinum' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sponsor.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sponsor.website ? (
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0c372b] hover:text-[#0a2d22]"
                        >
                          Visit Site
                        </a>
                      ) : (
                        'No website'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sponsor.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRemoveSponsor(sponsor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Settings</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Details</h3>
              <form onSubmit={handleSettingsUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventSettings.eventDate}
                      onChange={(e) => setEventSettings({...eventSettings, eventDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Time
                    </label>
                    <input
                      type="text"
                      value={eventSettings.eventTime}
                      onChange={(e) => setEventSettings({...eventSettings, eventTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue
                    </label>
                    <input
                      type="text"
                      value={eventSettings.venue}
                      onChange={(e) => setEventSettings({...eventSettings, venue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={eventSettings.maxParticipants}
                      onChange={(e) => setEventSettings({...eventSettings, maxParticipants: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="registrationOpen"
                      checked={eventSettings.registrationOpen}
                      onChange={(e) => setEventSettings({...eventSettings, registrationOpen: e.target.checked})}
                      className="h-4 w-4 text-[#0c372b] focus:ring-[#0c372b] border-gray-300 rounded"
                    />
                    <label htmlFor="registrationOpen" className="ml-2 block text-sm text-gray-900">
                      Registration Open
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 bg-[#0c372b] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#0a2d22] transition-colors"
                >
                  Update Settings
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">External Links</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    American Cancer Society Donation Link
                  </label>
                  <input
                    type="url"
                    value={eventSettings.acsLink}
                    onChange={(e) => setEventSettings({...eventSettings, acsLink: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                  />
                  <a
                    href={eventSettings.acsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0c372b] hover:text-[#0a2d22] text-sm mt-1 inline-block"
                  >
                    Test Link →
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venmo Handle for Event Support
                  </label>
                  <input
                    type="text"
                    value={eventSettings.venmoHandle}
                    onChange={(e) => setEventSettings({...eventSettings, venmoHandle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c372b] focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Used for direct event support donations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}