import type { TeamMember, MoodEntry } from '@agentic-rn/core';

/** Create a mood entry relative to "now" (2026-02-26T10:00:00Z). */
function mood(emoji: string, label: string, hoursAgo: number): MoodEntry {
  const d = new Date('2026-02-26T10:00:00Z');
  d.setHours(d.getHours() - hoursAgo);
  return { emoji, label, timestamp: d.toISOString() };
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Engineering Lead',
    avatarUrl: null,
    status: 'active',
    currentMood: mood('😊', 'Happy', 1),
    moodHistory: [
      mood('😊', 'Happy', 1),
      mood('🔥', 'Fired Up', 5),
      mood('😊', 'Happy', 24),
      mood('🤔', 'Thinking', 48),
      mood('😊', 'Happy', 72),
      mood('😐', 'Neutral', 96),
    ],
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'Senior Developer',
    avatarUrl: null,
    status: 'active',
    currentMood: mood('🔥', 'Fired Up', 1.25),
    moodHistory: [
      mood('🔥', 'Fired Up', 1.25),
      mood('🔥', 'Fired Up', 8),
      mood('😊', 'Happy', 26),
      mood('🤔', 'Thinking', 50),
      mood('😴', 'Tired', 74),
      mood('😊', 'Happy', 100),
      mood('🔥', 'Fired Up', 120),
    ],
  },
  {
    id: '3',
    name: 'Priya Patel',
    role: 'UX Designer',
    avatarUrl: null,
    status: 'active',
    currentMood: mood('😊', 'Happy', 0.75),
    moodHistory: [
      mood('😊', 'Happy', 0.75),
      mood('🤔', 'Thinking', 6),
      mood('😊', 'Happy', 25),
      mood('😊', 'Happy', 49),
      mood('🔥', 'Fired Up', 73),
      mood('😐', 'Neutral', 97),
    ],
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Backend Developer',
    avatarUrl: null,
    status: 'away',
    currentMood: mood('😐', 'Neutral', 2.5),
    moodHistory: [
      mood('😐', 'Neutral', 2.5),
      mood('😴', 'Tired', 10),
      mood('😐', 'Neutral', 28),
      mood('😊', 'Happy', 52),
      mood('🤔', 'Thinking', 76),
    ],
  },
  {
    id: '5',
    name: 'Aisha Mohammed',
    role: 'Product Manager',
    avatarUrl: null,
    status: 'active',
    currentMood: mood('😊', 'Happy', 0.5),
    moodHistory: [
      mood('😊', 'Happy', 0.5),
      mood('🔥', 'Fired Up', 4),
      mood('😊', 'Happy', 24),
      mood('🔥', 'Fired Up', 48),
      mood('😊', 'Happy', 72),
      mood('😤', 'Stressed', 96),
      mood('😊', 'Happy', 120),
    ],
  },
  {
    id: '6',
    name: 'Tom Rivera',
    role: 'QA Engineer',
    avatarUrl: null,
    status: 'active',
    currentMood: mood('😴', 'Tired', 2),
    moodHistory: [
      mood('😴', 'Tired', 2),
      mood('😐', 'Neutral', 9),
      mood('😴', 'Tired', 27),
      mood('😊', 'Happy', 51),
      mood('😐', 'Neutral', 75),
    ],
  },
  {
    id: '7',
    name: 'Elena Volkov',
    role: 'DevOps Engineer',
    avatarUrl: null,
    status: 'away',
    currentMood: mood('🤔', 'Thinking', 3.25),
    moodHistory: [
      mood('🤔', 'Thinking', 3.25),
      mood('😊', 'Happy', 12),
      mood('🤔', 'Thinking', 30),
      mood('🔥', 'Fired Up', 54),
      mood('😊', 'Happy', 78),
      mood('😐', 'Neutral', 102),
    ],
  },
  {
    id: '8',
    name: "James O'Brien",
    role: 'Data Analyst',
    avatarUrl: null,
    status: 'offline',
    currentMood: mood('🔥', 'Fired Up', 17),
    moodHistory: [
      mood('🔥', 'Fired Up', 17),
      mood('😊', 'Happy', 30),
      mood('😐', 'Neutral', 54),
      mood('🤔', 'Thinking', 78),
      mood('😊', 'Happy', 102),
    ],
  },
];
