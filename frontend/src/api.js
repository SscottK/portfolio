const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return response.json()
}

export function getProjects(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, 'true')
  })
  const query = search.toString()
  return request(`/api/projects/${query ? `?${query}` : ''}`)
}

export function getProject(slug) {
  return request(`/api/projects/${slug}/`)
}

export function getProfile() {
  return request('/api/profile/')
}
