export const GROUPS = {
  A: ['Mexico', 'South Africa', 'South Korea', 'Czechia'],
  B: ['Canada', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['USA', 'Paraguay', 'Australia', 'Türkiye'],
  E: ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Iraq', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
  L: ['England', 'Croatia', 'Ghana', 'Panama'],
}

export const POTS = {
  'Pot 1': [
    { name: 'France',      flag: '🇫🇷', group: 'I' },
    { name: 'Spain',       flag: '🇪🇸', group: 'H' },
    { name: 'Argentina',   flag: '🇦🇷', group: 'J' },
    { name: 'England',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
    { name: 'Portugal',    flag: '🇵🇹', group: 'K' },
    { name: 'Brazil',      flag: '🇧🇷', group: 'C' },
    { name: 'Netherlands', flag: '🇳🇱', group: 'F' },
    { name: 'Morocco',     flag: '🇲🇦', group: 'C' },
    { name: 'Belgium',     flag: '🇧🇪', group: 'G' },
    { name: 'Germany',     flag: '🇩🇪', group: 'E' },
    { name: 'Croatia',     flag: '🇭🇷', group: 'L' },
    { name: 'Colombia',    flag: '🇨🇴', group: 'K' },
  ],
  'Pot 2': [
    { name: 'Senegal',     flag: '🇸🇳', group: 'I' },
    { name: 'Mexico',      flag: '🇲🇽', group: 'A' },
    { name: 'USA',         flag: '🇺🇸', group: 'D' },
    { name: 'Uruguay',     flag: '🇺🇾', group: 'H' },
    { name: 'Japan',       flag: '🇯🇵', group: 'F' },
    { name: 'Switzerland', flag: '🇨🇭', group: 'B' },
    { name: 'Iran',        flag: '🇮🇷', group: 'G' },
    { name: 'Austria',     flag: '🇦🇹', group: 'J' },
    { name: 'Ecuador',     flag: '🇪🇨', group: 'E' },
    { name: 'South Korea', flag: '🇰🇷', group: 'A' },
    { name: 'Australia',   flag: '🇦🇺', group: 'D' },
    { name: 'Egypt',       flag: '🇪🇬', group: 'G' },
  ],
  'Pot 3': [
    { name: 'Canada',      flag: '🇨🇦', group: 'B' },
    { name: 'Ivory Coast', flag: '🇨🇮', group: 'E' },
    { name: 'Qatar',       flag: '🇶🇦', group: 'B' },
    { name: 'Algeria',     flag: '🇩🇿', group: 'J' },
    { name: 'Sweden',      flag: '🇸🇪', group: 'F' },
    { name: 'Paraguay',    flag: '🇵🇾', group: 'D' },
    { name: 'Czechia',     flag: '🇨🇿', group: 'A' },
    { name: 'Türkiye',     flag: '🇹🇷', group: 'D' },
    { name: 'Scotland',    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
    { name: 'DR Congo',    flag: '🇨🇩', group: 'K' },
    { name: 'Tunisia',     flag: '🇹🇳', group: 'F' },
    { name: 'Norway',      flag: '🇳🇴', group: 'I' },
  ],
  'Pot 4': [
    { name: 'Uzbekistan',          flag: '🇺🇿', group: 'K' },
    { name: 'Bosnia & Herzegovina',flag: '🇧🇦', group: 'B' },
    { name: 'Panama',              flag: '🇵🇦', group: 'L' },
    { name: 'Iraq',                flag: '🇮🇶', group: 'I' },
    { name: 'South Africa',        flag: '🇿🇦', group: 'A' },
    { name: 'Saudi Arabia',        flag: '🇸🇦', group: 'H' },
    { name: 'Jordan',              flag: '🇯🇴', group: 'J' },
    { name: 'Cape Verde',          flag: '🇨🇻', group: 'H' },
    { name: 'Ghana',               flag: '🇬🇭', group: 'L' },
    { name: 'Haiti',               flag: '🇭🇹', group: 'C' },
    { name: 'Curaçao',             flag: '🇨🇼', group: 'E' },
    { name: 'New Zealand',         flag: '🇳🇿', group: 'G' },
  ],
}

export const ALL_TEAMS = Object.values(POTS).flat()

export const TEAM_MAP = Object.fromEntries(ALL_TEAMS.map(t => [t.name, t]))

export const FIXTURES = [
  // Group A
  { id: 'A1', date: '2026-06-11', home: 'Mexico',       away: 'South Africa', group: 'A' },
  { id: 'A2', date: '2026-06-11', home: 'South Korea',  away: 'Czechia',      group: 'A' },
  { id: 'A3', date: '2026-06-18', home: 'Mexico',       away: 'South Korea',  group: 'A' },
  { id: 'A4', date: '2026-06-18', home: 'Czechia',      away: 'South Africa', group: 'A' },
  { id: 'A5', date: '2026-06-24', home: 'Czechia',      away: 'Mexico',       group: 'A' },
  { id: 'A6', date: '2026-06-24', home: 'South Africa', away: 'South Korea',  group: 'A' },
  // Group B
  { id: 'B1', date: '2026-06-12', home: 'Canada',               away: 'Bosnia & Herzegovina', group: 'B' },
  { id: 'B2', date: '2026-06-13', home: 'Qatar',                away: 'Switzerland',          group: 'B' },
  { id: 'B3', date: '2026-06-18', home: 'Canada',               away: 'Qatar',                group: 'B' },
  { id: 'B4', date: '2026-06-19', home: 'Switzerland',          away: 'Bosnia & Herzegovina', group: 'B' },
  { id: 'B5', date: '2026-06-24', home: 'Switzerland',          away: 'Canada',               group: 'B' },
  { id: 'B6', date: '2026-06-24', home: 'Bosnia & Herzegovina', away: 'Qatar',                group: 'B' },
  // Group C
  { id: 'C1', date: '2026-06-13', home: 'Brazil',   away: 'Morocco',  group: 'C' },
  { id: 'C2', date: '2026-06-13', home: 'Haiti',    away: 'Scotland', group: 'C' },
  { id: 'C3', date: '2026-06-19', home: 'Scotland', away: 'Morocco',  group: 'C' },
  { id: 'C4', date: '2026-06-19', home: 'Brazil',   away: 'Haiti',    group: 'C' },
  { id: 'C5', date: '2026-06-23', home: 'Morocco',  away: 'Haiti',    group: 'C' },
  { id: 'C6', date: '2026-06-23', home: 'Scotland', away: 'Brazil',   group: 'C' },
  // Group D
  { id: 'D1', date: '2026-06-12', home: 'USA',       away: 'Paraguay',  group: 'D' },
  { id: 'D2', date: '2026-06-13', home: 'Australia', away: 'Türkiye',   group: 'D' },
  { id: 'D3', date: '2026-06-19', home: 'USA',       away: 'Australia', group: 'D' },
  { id: 'D4', date: '2026-06-19', home: 'Türkiye',   away: 'Paraguay',  group: 'D' },
  { id: 'D5', date: '2026-06-25', home: 'Türkiye',   away: 'USA',       group: 'D' },
  { id: 'D6', date: '2026-06-25', home: 'Paraguay',  away: 'Australia', group: 'D' },
  // Group E
  { id: 'E1', date: '2026-06-14', home: 'Germany',     away: 'Curaçao',     group: 'E' },
  { id: 'E2', date: '2026-06-14', home: 'Ivory Coast', away: 'Ecuador',     group: 'E' },
  { id: 'E3', date: '2026-06-20', home: 'Germany',     away: 'Ivory Coast', group: 'E' },
  { id: 'E4', date: '2026-06-20', home: 'Ecuador',     away: 'Curaçao',     group: 'E' },
  { id: 'E5', date: '2026-06-25', home: 'Ecuador',     away: 'Germany',     group: 'E' },
  { id: 'E6', date: '2026-06-25', home: 'Curaçao',     away: 'Ivory Coast', group: 'E' },
  // Group F
  { id: 'F1', date: '2026-06-14', home: 'Netherlands', away: 'Japan',       group: 'F' },
  { id: 'F2', date: '2026-06-14', home: 'Sweden',      away: 'Tunisia',     group: 'F' },
  { id: 'F3', date: '2026-06-20', home: 'Netherlands', away: 'Sweden',      group: 'F' },
  { id: 'F4', date: '2026-06-20', home: 'Tunisia',     away: 'Japan',       group: 'F' },
  { id: 'F5', date: '2026-06-25', home: 'Japan',       away: 'Sweden',      group: 'F' },
  { id: 'F6', date: '2026-06-25', home: 'Tunisia',     away: 'Netherlands', group: 'F' },
  // Group G
  { id: 'G1', date: '2026-06-15', home: 'Belgium',     away: 'Egypt',       group: 'G' },
  { id: 'G2', date: '2026-06-15', home: 'Iran',        away: 'New Zealand', group: 'G' },
  { id: 'G3', date: '2026-06-21', home: 'Belgium',     away: 'Iran',        group: 'G' },
  { id: 'G4', date: '2026-06-21', home: 'New Zealand', away: 'Egypt',       group: 'G' },
  { id: 'G5', date: '2026-06-26', home: 'Egypt',       away: 'Iran',        group: 'G' },
  { id: 'G6', date: '2026-06-26', home: 'New Zealand', away: 'Belgium',     group: 'G' },
  // Group H
  { id: 'H1', date: '2026-06-15', home: 'Spain',        away: 'Cape Verde',  group: 'H' },
  { id: 'H2', date: '2026-06-15', home: 'Saudi Arabia', away: 'Uruguay',     group: 'H' },
  { id: 'H3', date: '2026-06-21', home: 'Spain',        away: 'Saudi Arabia',group: 'H' },
  { id: 'H4', date: '2026-06-21', home: 'Uruguay',      away: 'Cape Verde',  group: 'H' },
  { id: 'H5', date: '2026-06-26', home: 'Cape Verde',   away: 'Saudi Arabia',group: 'H' },
  { id: 'H6', date: '2026-06-26', home: 'Uruguay',      away: 'Spain',       group: 'H' },
  // Group I
  { id: 'I1', date: '2026-06-16', home: 'France',  away: 'Senegal', group: 'I' },
  { id: 'I2', date: '2026-06-16', home: 'Iraq',    away: 'Norway',  group: 'I' },
  { id: 'I3', date: '2026-06-22', home: 'France',  away: 'Iraq',    group: 'I' },
  { id: 'I4', date: '2026-06-22', home: 'Norway',  away: 'Senegal', group: 'I' },
  { id: 'I5', date: '2026-06-26', home: 'Norway',  away: 'France',  group: 'I' },
  { id: 'I6', date: '2026-06-26', home: 'Senegal', away: 'Iraq',    group: 'I' },
  // Group J
  { id: 'J1', date: '2026-06-16', home: 'Argentina', away: 'Algeria', group: 'J' },
  { id: 'J2', date: '2026-06-16', home: 'Austria',   away: 'Jordan',  group: 'J' },
  { id: 'J3', date: '2026-06-22', home: 'Argentina', away: 'Austria', group: 'J' },
  { id: 'J4', date: '2026-06-22', home: 'Jordan',    away: 'Algeria', group: 'J' },
  { id: 'J5', date: '2026-06-27', home: 'Algeria',   away: 'Austria', group: 'J' },
  { id: 'J6', date: '2026-06-27', home: 'Jordan',    away: 'Argentina',group: 'J' },
  // Group K
  { id: 'K1', date: '2026-06-17', home: 'Portugal',   away: 'DR Congo',   group: 'K' },
  { id: 'K2', date: '2026-06-17', home: 'Uzbekistan', away: 'Colombia',   group: 'K' },
  { id: 'K3', date: '2026-06-23', home: 'Portugal',   away: 'Uzbekistan', group: 'K' },
  { id: 'K4', date: '2026-06-23', home: 'Colombia',   away: 'DR Congo',   group: 'K' },
  { id: 'K5', date: '2026-06-27', home: 'Colombia',   away: 'Portugal',   group: 'K' },
  { id: 'K6', date: '2026-06-27', home: 'DR Congo',   away: 'Uzbekistan', group: 'K' },
  // Group L
  { id: 'L1', date: '2026-06-17', home: 'England', away: 'Croatia', group: 'L' },
  { id: 'L2', date: '2026-06-17', home: 'Ghana',   away: 'Panama',  group: 'L' },
  { id: 'L3', date: '2026-06-23', home: 'England', away: 'Ghana',   group: 'L' },
  { id: 'L4', date: '2026-06-23', home: 'Panama',  away: 'Croatia', group: 'L' },
  { id: 'L5', date: '2026-06-27', home: 'England', away: 'Panama',  group: 'L' },
  { id: 'L6', date: '2026-06-27', home: 'Croatia', away: 'Ghana',   group: 'L' },
]

export const ROUND_POINTS = {
  group: { W: 2, D: 1, L: 0 },
  r32:   { W: 2 },
  r16:   { W: 3 },
  qf:    { W: 4 },
  sf:    { W: 5 },
  final: { W: 6 },
}

export const ROUND_LABELS = {
  group: 'Group Stage',
  r32:   'Round of 32',
  r16:   'Round of 16',
  qf:    'Quarter-Final',
  sf:    'Semi-Final',
  final: 'Final',
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
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
    scored   += r.scored   || 0
    conceded += r.conceded || 0
  })
  ;['r32', 'r16', 'qf', 'sf', 'final'].forEach(round => {
    if (tp[round]) {
      scored   += tp[round].scored   || 0
      conceded += tp[round].conceded || 0
    }
  })
  return { scored, conceded }
}

// Calculate group standings from fixture results
export function calcGroupStandings(fixtureResults) {
  const standings = {}
  Object.keys(GROUPS).forEach(group => {
    standings[group] = GROUPS[group].map(name => ({
      name,
      flag: TEAM_MAP[name]?.flag || '',
      group,
      played: 0, won: 0, drawn: 0, lost: 0,
      gf: 0, ga: 0, gd: 0, pts: 0,
    }))
  })

  FIXTURES.forEach(fixture => {
