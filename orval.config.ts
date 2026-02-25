import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './packages/core/openapi.json',
    output: {
      target: './packages/core/src/generated/hooks',
      schemas: './packages/core/src/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './packages/core/src/fetcher.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
