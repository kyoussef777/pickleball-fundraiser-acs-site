// API utility functions for the admin panel

interface EventSettings {
  eventDate: string;
  eventTime: string;
  venue: string;
  acsLink: string;
  venmoHandle: string;
  maxParticipants: number;
  registrationOpen: boolean;
}

interface Participant {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skillLevel: string;
  dietaryRestrictions?: string;
}

interface Volunteer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  availability: string[];
  roles: string[];
  experience?: string;
  emergencyContact: string;
  emergencyPhone: string;
  additionalInfo?: string;
}

interface Sponsor {
  name: string;
  website?: string;
  tier: 'GOLD' | 'PLATINUM';
  logoUrl?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

interface ContentBlock {
  key: string;
  title: string;
  content: string;
  contentType?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export class ApiClient {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || 'Request failed')
    }

    return response.json()
  }

  // Settings API
  static async getSettings() {
    return this.request('/api/settings')
  }

  static async updateSettings(settings: EventSettings) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  // Participants API
  static async getParticipants() {
    return this.request('/api/participants')
  }

  static async createParticipant(data: Participant) {
    return this.request('/api/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async updateParticipant(data: Participant & { id: string }) {
    return this.request('/api/participants', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  static async deleteParticipant(id: string) {
    return this.request(`/api/participants?id=${id}`, {
      method: 'DELETE',
    })
  }

  // Volunteers API
  static async getVolunteers() {
    return this.request('/api/volunteers')
  }

  static async createVolunteer(data: Volunteer) {
    return this.request('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async updateVolunteer(data: Volunteer & { id: string }) {
    return this.request('/api/volunteers', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  static async deleteVolunteer(id: string) {
    return this.request(`/api/volunteers?id=${id}`, {
      method: 'DELETE',
    })
  }

  // Sponsors API
  static async getSponsors() {
    return this.request('/api/sponsors')
  }

  static async createSponsor(data: Sponsor) {
    return this.request('/api/sponsors', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async updateSponsor(data: Sponsor & { id: string }) {
    return this.request('/api/sponsors', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  static async deleteSponsor(id: string) {
    return this.request(`/api/sponsors?id=${id}`, {
      method: 'DELETE',
    })
  }

  // Content API
  static async getContent(key?: string) {
    const url = key ? `/api/content?key=${key}` : '/api/content'
    return this.request(url)
  }

  static async createContent(data: ContentBlock) {
    return this.request('/api/content', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async updateContent(data: ContentBlock & { id: string }) {
    return this.request('/api/content', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  static async deleteContent(id: string) {
    return this.request(`/api/content?id=${id}`, {
      method: 'DELETE',
    })
  }
}