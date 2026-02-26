export const queryKeys = {
  team: {
    all: ['team'] as const,
    detail: (id: string) => ['team', id] as const,
  },
} as const;
