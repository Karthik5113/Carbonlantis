import { publicHomeData } from '../data/publicHome';
import { AlertItemData, DeploymentSite, StatItem } from '../types';

/**
 * Carbonlantis API Configuration
 * Supports environment variables configured for Django REST Framework (DRF) backend
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

interface ApiResponse<T> {
  data: T;
  isLive: boolean;
  source: 'api' | 'demo-cache';
  error?: string;
}

/**
 * Generic fetch wrapper with timeout and error fallback
 */
async function fetchWithFallback<T>(endpoint: string, fallbackData: T): Promise<ApiResponse<T>> {
  if (!ENABLE_MOCK_FALLBACK) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return { data, isLive: true, source: 'api' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second quick check for backend

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      // Backend returned non-200, fallback to demo data
      return {
        data: fallbackData,
        isLive: false,
        source: 'demo-cache',
        error: `DRF endpoint returned ${res.status}. Falling back to demonstration data.`
      };
    }

    const data = await res.json();
    return {
      data,
      isLive: true,
      source: 'api'
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    // Network error or timeout: seamlessly supply demo data
    const message = err instanceof Error ? err.message : 'Backend unreachable';
    return {
      data: fallbackData,
      isLive: false,
      source: 'demo-cache',
      error: `Django API offline (${message}). Displaying reference demonstration data.`
    };
  }
}

/**
 * Public Platform API Service
 * Ready for future Django REST Framework endpoints
 */
export const publicApiService = {
  /**
   * Fetch public high-level platform statistics
   * Endpoint: GET /api/v1/public/stats/
   */
  async getPublicStats(): Promise<ApiResponse<StatItem[]>> {
    return fetchWithFallback<StatItem[]>('/public/stats/', publicHomeData.stats);
  },

  /**
   * Fetch public deployment sites and coordinates
   * Endpoint: GET /api/v1/public/deployments/
   */
  async getPublicDeployments(): Promise<ApiResponse<DeploymentSite[]>> {
    return fetchWithFallback<DeploymentSite[]>('/public/deployments/', publicHomeData.deployments);
  },

  /**
   * Fetch public system alerts and status announcements
   * Endpoint: GET /api/v1/public/alerts/
   */
  async getPublicAlerts(): Promise<ApiResponse<AlertItemData[]>> {
    return fetchWithFallback<AlertItemData[]>('/public/alerts/', publicHomeData.alerts);
  },

  /**
   * Check connection to Django REST Framework backend
   * Endpoint: GET /api/v1/health/
   */
  async checkBackendHealth(): Promise<{ online: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health/`, { method: 'GET' });
      return { online: res.ok, message: res.ok ? 'Backend Connected' : 'Backend degraded' };
    } catch {
      return { online: false, message: 'DRF Backend Offline (Using Demo Data)' };
    }
  }
};

