export const POTS = {
  "Pot 1": [
    { name: "Argentina", flag: "🇦🇷" },
    { name: "France", flag: "🇫🇷" },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Portugal", flag: "🇵🇹" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "Belgium", flag: "🇧🇪" },
    { name: "Netherlands", flag: "🇳🇱" },
  ],
  "Pot 2": [
    { name: "Germany", flag: "🇩🇪" },
    { name: "Croatia", flag: "🇭🇷" },
    { name: "USA", flag: "🇺🇸" },
    { name: "Uruguay", flag: "🇺🇾" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "Switzerland", flag: "🇨🇭" },
    { name: "Denmark", flag: "🇩🇰" },
    { name: "Senegal", flag: "🇸🇳" },
  ],
  "Pot 3": [
    { name: "Poland", flag: "🇵🇱" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
    { name: "Ecuador", flag: "🇪🇨" },
    { name: "Morocco", flag: "🇲🇦" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Tunisia", flag: "🇹🇳" },
    { name: "South Korea", flag: "🇰🇷" },
  ],
  "Pot 4": [
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "Costa Rica", flag: "🇨🇷" },
    { name: "Iran", flag: "🇮🇷" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Qatar", flag: "🇶🇦" },
    { name: "Cameroon", flag: "🇨🇲" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Serbia", flag: "🇷🇸" },
  ],
}

export const ALL_TEAMS = Object.values(POTS).flat()

export const ROUND_POINTS = {
  group: { W: 2, D: 1, L: 0 },
  r16:   { W: 3 },
  qf:    { W: 4 },
  sf:    { W: 5 },
  final: { W: 6 },
}

export const ROUND_LABELS = {
  group: "Group Stage",
  r16:   "Round of 16",
  qf:    "Quarter-Final",
  sf:    "Semi-Final",
  final: "Final",
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function calcTeamPoints(tp) {
  if (!tp) return 0
  let s = 0
  ;(tp.group || []).forEach(r => { s += ROUND_POINTS.group[r.result] || 0 })
  if (tp.r16?.result   === 'W') s += ROUND_POINTS.r16.W
  if (tp.qf?.result    === 'W') s += ROUND_POINTS.qf.W
  if (tp.sf?.result    === 'W') s += ROUND_POINTS.sf.W
  if (tp.final?.result === 'W') s += ROUND_POINTS.final.W
  return s
}

export function calcTeamGoals(tp) {
  if (!tp) return { scored: 0, conceded: 0 }
  let scored = 0, conceded = 0
  ;(tp.group || []).forEach(r => {
    scored += r.scored || 0
    conceded += r.conceded || 0
  })
  ;['r16', 'qf', 'sf', 'final'].forEach(round => {
    if (tp[round]) {
      scored += tp[round].scored || 0
      conceded += tp[round].conceded || 0
    }
  })
  return { scored, conceded }
}
