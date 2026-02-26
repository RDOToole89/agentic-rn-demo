/**
 * Custom fetch wrapper for orval-generated hooks.
 *
 * This is the mutator function that orval injects into every generated
 * API call. It handles base URL resolution, JSON serialization, error
 * wrapping, and AbortSignal threading.
 */

declare const process: { env: Record<string, string | undefined> };

const getBaseUrl = () =>
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
  ) {
    super(`API ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const baseUrl = getBaseUrl();
  const fullUrl = `${baseUrl}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(response.status, response.statusText, errorBody);
  }

  return response.json() as Promise<T>;
};

export default customFetch;
