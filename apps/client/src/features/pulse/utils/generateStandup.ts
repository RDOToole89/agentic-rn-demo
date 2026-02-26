import type { TeamMember } from '@agentic-rn/core';

interface MoodAnalysis {
  dominantMood: { label: string; emoji: string; count: number };
  outliers: { name: string; mood: string; emoji: string }[];
  streaks: { name: string; mood: string; length: number }[];
  shipConfidence: number;
  total: number;
}

function analyzeMoods(members: TeamMember[]): MoodAnalysis {
  const counts = new Map<string, { label: string; emoji: string; count: number }>();

  for (const member of members) {
    const key = member.currentMood.label;
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, { label: key, emoji: member.currentMood.emoji, count: 1 });
    }
  }

  let dominantMood = { label: 'Unknown', emoji: '😶', count: 0 };
  for (const entry of counts.values()) {
    if (entry.count > dominantMood.count) dominantMood = entry;
  }

  // Outliers: members with a mood that only 1 person has, especially Tired/Stressed
  const outliers: MoodAnalysis['outliers'] = [];
  for (const member of members) {
    const moodCount = counts.get(member.currentMood.label)?.count ?? 0;
    if (moodCount === 1) {
      outliers.push({
        name: member.name.split(' ')[0],
        mood: member.currentMood.label,
        emoji: member.currentMood.emoji,
      });
    }
  }

  // Streaks: consecutive same-mood entries in moodHistory (length >= 2)
  const streaks: MoodAnalysis['streaks'] = [];
  for (const member of members) {
    const history = member.moodHistory;
    if (history.length < 2) continue;

    let currentStreak = 1;
    let streakMood = history[0].label;

    for (let i = 1; i < history.length; i++) {
      if (history[i].label === streakMood) {
        currentStreak++;
      } else {
        if (currentStreak >= 2) {
          streaks.push({
            name: member.name.split(' ')[0],
            mood: streakMood,
            length: currentStreak,
          });
        }
        currentStreak = 1;
        streakMood = history[i].label;
      }
    }
    if (currentStreak >= 2) {
      streaks.push({
        name: member.name.split(' ')[0],
        mood: streakMood,
        length: currentStreak,
      });
    }
  }

  // Ship confidence: percentage of Happy or Fired Up members
  const positiveCount = members.filter(
    (m) => m.currentMood.label === 'Happy' || m.currentMood.label === 'Fired Up',
  ).length;
  const shipConfidence = Math.min(
    99,
    Math.max(10, Math.round((positiveCount / members.length) * 100)),
  );

  return { dominantMood, outliers, streaks, shipConfidence, total: members.length };
}

function outlierLine(outliers: MoodAnalysis['outliers']): string {
  if (outliers.length === 0) return '';
  return outliers
    .map((o) => `${o.name} is feeling ${o.mood.toLowerCase()} ${o.emoji}`)
    .join(', ');
}

function streakLine(streaks: MoodAnalysis['streaks']): string {
  if (streaks.length === 0) return '';
  const s = streaks[0];
  return `${s.name} has been ${s.mood.toLowerCase()} for ${s.length} check-ins straight`;
}

// Template 0: Military briefing
function morningBriefing(a: MoodAnalysis): string {
  let text = `MORNING BRIEFING — ${a.total} souls reporting for duty.\n\n`;
  text += `Dominant mood across the unit: ${a.dominantMood.emoji} ${a.dominantMood.label} (${a.dominantMood.count}/${a.total}).\n\n`;
  const ol = outlierLine(a.outliers);
  if (ol) text += `Outlier report: ${ol}. Keep an eye on them.\n\n`;
  const sl = streakLine(a.streaks);
  if (sl) text += `Intel shows ${sl}. Noted.\n\n`;
  text += `Ship confidence rating: ${a.shipConfidence}%. The mission continues.`;
  return text;
}

// Template 1: Weather forecast
function weatherReport(a: MoodAnalysis): string {
  let text = `TODAY'S MOOD FORECAST ☁️\n\n`;
  text += `Current conditions: mostly ${a.dominantMood.label.toLowerCase()} ${a.dominantMood.emoji} with ${a.dominantMood.count} out of ${a.total} reporting similar skies.\n\n`;
  const ol = outlierLine(a.outliers);
  if (ol) text += `Scattered anomalies detected — ${ol}. Pack accordingly.\n\n`;
  const sl = streakLine(a.streaks);
  if (sl) text += `Extended forecast: ${sl}. No change expected.\n\n`;
  text += `Chance of shipping: ${a.shipConfidence}%.`;
  return text;
}

// Template 2: Sports commentary
function sportsCommentary(a: MoodAnalysis): string {
  let text = `AND WE'RE LIVE! 🎙️\n\n`;
  text += `The team is coming in ${a.dominantMood.label.toLowerCase()} ${a.dominantMood.emoji} today — ${a.dominantMood.count} of ${a.total} players in sync.\n\n`;
  const ol = outlierLine(a.outliers);
  if (ol) text += `But wait — ${ol}. Could be a wildcard play!\n\n`;
  const sl = streakLine(a.streaks);
  if (sl) text += `Streak alert: ${sl}. Consistency is key, folks.\n\n`;
  text += `Ship-o-meter reads ${a.shipConfidence}%. Game on.`;
  return text;
}

// Template 3: Ship captain's log
function captainsLog(a: MoodAnalysis): string {
  let text = `CAPTAIN'S LOG ⚓\n\n`;
  text += `Crew morale check: ${a.dominantMood.count} of ${a.total} hands reporting ${a.dominantMood.label.toLowerCase()} ${a.dominantMood.emoji}. Steady as she goes.\n\n`;
  const ol = outlierLine(a.outliers);
  if (ol) text += `From the crow's nest: ${ol}. Keep them above deck.\n\n`;
  const sl = streakLine(a.streaks);
  if (sl) text += `Ship's log notes: ${sl}. A sailor of habit.\n\n`;
  text += `Probability of making port on time: ${a.shipConfidence}%.`;
  return text;
}

// Template 4: Startup standup
function startupStandup(a: MoodAnalysis): string {
  let text = `STANDUP SYNC 🚀\n\n`;
  text += `Vibes check: the team is ${a.dominantMood.label.toLowerCase()} ${a.dominantMood.emoji} — ${a.dominantMood.count}/${a.total} aligned. We love alignment.\n\n`;
  const ol = outlierLine(a.outliers);
  if (ol) text += `Meanwhile, ${ol}. Let's unblock them over coffee.\n\n`;
  const sl = streakLine(a.streaks);
  if (sl) text += `Fun fact: ${sl}. That's called personal branding.\n\n`;
  text += `Ship confidence: ${a.shipConfidence}%. Investors would be proud.`;
  return text;
}

const templates = [
  morningBriefing,
  weatherReport,
  sportsCommentary,
  captainsLog,
  startupStandup,
];

export function generateStandup(members: TeamMember[], variation: number): string {
  if (members.length === 0) return 'No team members to analyze. Add some people first!';

  const analysis = analyzeMoods(members);
  const template = templates[variation % templates.length];
  return template(analysis);
}
