export const POTS = {
  "Pot 1": [
    { name: "France", flag: "🇫🇷" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "Argentina", flag: "🇦🇷" },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { name: "Portugal", flag: "🇵🇹" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "Morocco", flag: "🇲🇦" },
    { name: "Belgium", flag: "🇧🇪" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Croatia", flag: "🇭🇷" },
    { name: "Colombia", flag: "🇨🇴" },
  ],
  "Pot 2": [
    { name: "Senegal", flag: "🇸🇳" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "USA", flag: "🇺🇸" },
    { name: "Uruguay", flag: "🇺🇾" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Switzerland", flag: "🇨🇭" },
    { name: "Iran", flag: "🇮🇷" },
    { name: "Austria", flag: "🇦🇹" },
    { name: "Ecuador", flag: "🇪🇨" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Egypt", flag: "🇪🇬" },
  ],
  "Pot 3": [
    { name: "Canada", flag: "🇨🇦" },
    { name: "Ivory Coast", flag: "🇨🇮" },
    { name: "Qatar", flag: "🇶🇦" },
    { name: "Algeria", flag: "🇩🇿" },
    { name: "Sweden", flag: "🇸🇪" },
    { name: "Paraguay", flag: "🇵🇾" },
    { name: "Czechia", flag: "🇨🇿" },
    { name: "Türkiye", flag: "🇹🇷" },
    { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
    { name: "DR Congo", flag: "🇨🇩" },
    { name: "Tunisia", flag: "🇹🇳" },
    { name: "Norway", flag: "🇳🇴" },
  ],
  "Pot 4": [
    { name: "Uzbekistan", flag: "🇺🇿" },
    { name: "Bosnia & Herzegovina", flag: "🇧🇦" },
    { name: "Panama", flag: "🇵🇦" },
    { name: "Iraq", flag: "🇮🇶" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "Jordan", flag: "🇯" },
    { name: "Cape Verde", flag: "🇨🇻" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Haiti", flag: "🇭" },
    { name: "Curaçao", flag: "🇨🇼" },
    { name: "New Zealand", flag: "🇳🇿" },
  ],
}

export const ALL_TEAMS = Object.values(POTS).flat()

export const ROUND_POINTS = {
  group: { W: 2, D: 1, L: 0 },
  r32:   { W: 2 },
  r16:   { W: 3 },
  qf:    { W: 4 },
  sf:    { W: 5 },
  final: { W: 6 },
}

export const ROUND_LABELS = {
  group: "Group Stage",
  r32:   "Round of 32",
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
  if (tp.r32?.result   === 'W') s += ROUND_POINTS.r32.W
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
  ;['r32', 'r16', 'qf', 'sf', 'final'].forEach(round => {
    if (tp[round]) {
      scored += tp[round].scored || 0
      conceded += tp[round].conceded || 0
    }
  })
  return { scored, conceded }
}
