import { useFetch } from '@vueuse/core'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL
const AUTH_TOKEN: string = import.meta.env.VITE_AUTH_TOKEN

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

export async function fetchData<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
    ...options.headers
  }

  try {
    const { data, error } = await useFetch<T>(url, { ...options, headers }).json()
    if (error.value) throw error.value
    return data.value as T
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Error fetching data')
  }
}
