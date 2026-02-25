// Hand-written utilities
export type { Result } from './types';
export { ok, err } from './types';

// Custom fetcher
export { customFetch, ApiError } from './fetcher';

// Generated types (from OpenAPI spec via orval)
export * from './generated/models';

// Generated React Query hooks (from OpenAPI spec via orval)
export * from './generated/hooks/health/health';
export * from './generated/hooks/preferences/preferences';
export * from './generated/hooks/team/team';
