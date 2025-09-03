// API utility functions for the admin panel

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

  static async updateSettings(settings: any) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  // Participants API
  static async getParticipants() {
    return this.request('/api/participants')
  }

  static async createParticipant(data: any) {
    return this.request('/api/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async updateParticipant(data: any) {
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

  static async createVolunteer(data: any) {
    return this.request('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async updateVolunteer(data: any) {
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

  static async createSponsor(data: any) {
    return this.request('/api/sponsors', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async updateSponsor(data: any) {
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

  static async createContent(data: any) {
    return this.request('/api/content', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async updateContent(data: any) {
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