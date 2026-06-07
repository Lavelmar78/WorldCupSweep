export const GROUPS = {
  A: ['Mexico', 'South Africa', 'South Korea', 'Czechia'],
  B: ['Canada', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['USA', 'Paraguay', 'Australia', 'Turkiye'],
  E: ['Germany', 'Curacao', 'Ivory Coast', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Iraq', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
  L: ['England', 'Croatia', 'Ghana', 'Panama'],
}

const ENG = '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}'
const SCO = '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E006F}\u{E007F}'

export const POTS = {
  'Pot 1': [
    { name: 'France',      flag: '\uD83C\uDDEB\uD83C\uDDF7', group: 'I' },
    { name: 'Spain',       flag: '\uD83C\uDDEA\uD83C\uDDF8', group: 'H' },
    { name: 'Argentina',   flag: '\uD83C\uDDE6\uD83C\uDDF7', group: 'J' },
    { name: 'England',     flag: ENG, group: 'L' },
    { name: 'Portugal',    flag: '\uD83C\uDDF5\uD83C\uDDF9', group: 'K' },
    { name: 'Brazil',      flag: '\uD83C\uDDE7\uD83C\uDDF7', group: 'C' },
    { name: 'Netherlands', flag: '\uD83C\uDDF3\uD83C\uDDF1', group: 'F' },
    { name: 'Morocco',     flag: '\uD83C\uDDF2\uD83C\uDDE6', group: 'C' },
    { name: 'Belgium',     flag: '\uD83C\uDDE7\uD83C\uDDEA', group: 'G' },
    { name: 'Germany',     flag: '\uD83C\uDDE9\uD83C\uDDEA', group: 'E' },
    { name: 'Croatia',     flag: '\uD83C\uDDED\uD83C\uDDF7', group: 'L' },
    { name: 'Colombia',    flag: '\uD83C\uDDE8\uD83C\uDDF4', group: 'K' },
  ],
  'Pot 2': [
    { name: 'Senegal',     flag: '\uD83C\uDDF8\uD83C\uDDF3', group: 'I' },
    { name: 'Mexico',      flag: '\uD83C\uDDF2\uD83C\uDDFD', group: 'A' },
    { name: 'USA',         flag: '\uD83C\uDDFA\uD83C\uDDF8', group: 'D' },
    { name: 'Uruguay',     flag: '\uD83C\uDDFA\uD83C\uDDFE', group: 'H' },
    { name: 'Japan',       flag: '\uD83C\uDDEF\uD83C\uDDF5', group: 'F' },
    { name: 'Switzerland', flag: '\uD83C\uDDE8\uD83C\uDDED', group: 'B' },
    { name: 'Iran',        flag: '\uD83C\uDDEE\uD83C\uDDF7', group: 'G' },
    { name: 'Austria',     flag: '\uD83C\uDDE6\uD83C\uDDF9', group: 'J' },
    { name: 'Ecuador',     flag: '\uD83C\uDDEA\uD83C\uDDE8', group: 'E' },
    { name: 'South Korea', flag: '\uD83C\uDDF0\uD83C\uDDF7', group: 'A' },
    { name: 'Australia',   flag: '\uD83C\uDDE6\uD83C\uDDFA', group: 'D' },
    { name: 'Egypt',       flag: '\uD83C\uDDEA\uD83C\uDDEC', group: 'G' },
  ],
  'Pot 3': [
    { name: 'Canada',      flag: '\uD83C\uDDE8\uD83C\uDDE6', group: 'B' },
    { name: 'Ivory Coast', flag: '\uD83C\uDDE8\uD83C\uDDEE', group: 'E' },
    { name: 'Qatar',       flag: '\uD83C\uDDF6\uD83C\uDDE6', group: 'B' },
    { name: 'Algeria',     flag: '\uD83C\uDDE9\uD83C\uDDFF', group: 'J' },
    { name: 'Sweden',      flag: '\uD83C\uDDF8\uD83C\uDDEA', group: 'F' },
    { name: 'Paraguay',    flag: '\uD83C\uDDF5\uD83C\uDDFE', group: 'D' },
    { name: 'Czechia',     flag: '\uD83C\uDDE8\uD83C\uDDFF', group: 'A' },
    { name: 'Turkiye',     flag: '\uD83C\uDDF9\uD83C\uDDF7', group: 'D' },
    { name: 'Scotland',    flag: SCO, group: 'C' },
    { name: 'DR Congo',    flag: '\uD83C\uDDE8\uD83C\uDDE9', group: 'K' },
    { name: 'Tunisia',     flag: '\uD83C\uDDF9\uD83C\uDDF3', group: 'F' },
    { name: 'Norway',      flag: '\uD83C\uDDF3\uD83C\uDDF4', group: 'I' },
  ],
  'Pot 4': [
    { name: 'Uzbekistan',           flag: '\uD83C\uDDFA\uD83C\uDDFF', group: 'K' },
    { name: 'Bosnia & Herzegovina', flag: '\uD83C\uDDE7\uD83C\uDDE6', group: 'B' },
    { name: 'Panama',               flag: '\uD83C\uDDF5\uD83C\uDDE6', group: 'L' },
    { name: 'Iraq',                 flag: '\uD83C\uDDEE\uD83C\uDDF6', group: 'I' },
    { name: 'South Africa',         flag: '\uD83C\uDDFF\uD83C\uDDE6', group: 'A' },
    { name: 'Saudi Arabia',         flag: '\uD83C\uDDF8\uD83C\uDDE6', group: 'H' },
    { name: 'Jordan',               flag: '\uD83C\uDDEF\uD83C\uDDF4', group: 'J' },
    { name: 'Cape Verde',           flag: '\uD83C\uDDE8\uD83C\uDDFB', group: 'H' },
    { name: 'Ghana',                flag: '\uD83C\uDDEC\uD83C\uDDED', group: 'L' },
    { name: 'Haiti',                flag: '\uD83C\uDDED\uD83C\uDDF9', group: 'C' },
    { name: 'Curacao',              flag: '\uD83C\uDDE8\uD83C\uDDFC', group: 'E' },
    { name: 'New Zealand',          flag: '\uD83C\uDDF3\uD83C\uDDFF', group: 'G' },
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
  { id: 'D1', date: '2026-06-12', home: 'USA',      away: 'Paraguay',  group: 'D' },
  { id: 'D2', date: '2026-06-13', home: 'Australia',away: 'Turkiye',   group: 'D' },
  { id: 'D3', date: '2026-06-19', home: 'USA',      away: 'Australia', group: 'D' },
  { id: 'D4', date: '2026-06-19', home: 'Turkiye',  away: 'Paraguay',  group: 'D' },
  { id: 'D5', date: '2026-06-25', home: 'Turkiye',  away: 'USA',       group: 'D' },
  { id: 'D6', date: '2026-06-25', home: 'Paraguay', away: 'Australia', group: 'D' },
  // Group E
  { id: 'E1', date: '2026-06-14', home: 'Germany',     away: 'Curacao',     group: 'E' },
  { id: 'E2', date: '2026-06-14', home: 'Ivory Coast', away: 'Ecuador',     group: 'E' },
  { id: 'E3', date: '2026-06-20', home: 'Germany',     away: 'Ivory Coast', group: 'E' },
  { id: 'E4', date: '2026-06-20', home: 'Ecuador',     away: 'Curacao',     group: 'E' },
  { id: 'E5', date: '2026-06-25', home: 'Ecuador',     away: 'Germany',     group: 'E' },
  { id: 'E6', date: '2026-06-25', home: 'Curacao',     away: 'Ivory Coast', group: 'E' },
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
  { id: 'H1', date: '2026-06-15', home: 'Spain',        away: 'Cape Verde',   group: 'H' },
  { id: 'H2', date: '2026-06-15', home: 'Saudi Arabia', away: 'Uruguay',      group: 'H' },
  { id: 'H3', date: '2026-06-21', home: 'Spain',        away: 'Saudi Arabia', group: 'H' },
  { id: 'H4', date: '2026-06-21', home: 'Uruguay',      away: 'Cape Verde',   group: 'H' },
  { id: 'H5', date: '2026-06-26', home: 'Cape Verde',   away: 'Saudi Arabia', group: 'H' },
  { id: 'H6', date: '2026-06-26', home: 'Uruguay',      away: 'Spain',        group: 'H' },
  // Group I
  { id: 'I1', date: '2026-06-16', home: 'France',  away: 'Senegal', group: 'I' },
  { id: 'I2', date: '2026-06-16', home: 'Iraq',    away: 'Norway',  group: 'I' },
  { id: 'I3', date: '2026-06-22', home: 'France',  away: 'Iraq',    group: 'I' },
  { id: 'I4', date: '2026-06-22', home: 'Norway',  away: 'Senegal', group: 'I' },
  { id: 'I5', date: '2026-06-26', home: 'Norway',  away: 'France',  group: 'I' },
  { id: 'I6', date: '2026-06-26', home: 'Senegal', away: 'Iraq',    group: 'I' },
  // Group J
  { id: 'J1', date: '2026-06-16', home: 'Argentina', away: 'Algeria',   group: 'J' },
  { id: 'J2', date: '2026-06-16', home: 'Austria',   away: 'Jordan',    group: 'J' },
  { id: 'J3', date: '2026-06-22', home: 'Argentina', away: 'Austria',   group: 'J' },
  { id: 'J4', date: '2026-06-22', home: 'Jordan',    away: 'Algeria',   group: 'J' },
  { id: 'J5', date: '2026-06-27', home: 'Algeria',   away: 'Austria',   group: 'J' },
  { id: 'J6', date: '2026-06-27', home: 'Jordan',    away: 'Argentina', group: 'J' },
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
    const result = fixtureResults?.[fixture.id]
    if (!result || result.homeScore === undefined) return
    const hs = Number(result.homeScore)
    const as = Number(result.awayScore)
    const group = standings[fixture.group]
    if (!group) return
    const homeTeam = group.find(t => t.name === fixture.home)
    const awayTeam = group.find(t => t.name === fixture.away)
    if (!homeTeam || !awayTeam) return

    homeTeam.played++; awayTeam.played++
    homeTeam.gf += hs; homeTeam.ga += as
    awayTeam.gf += as; awayTeam.ga += hs
    homeTeam.gd = homeTeam.gf - homeTeam.ga
    awayTeam.gd = awayTeam.gf - awayTeam.ga

    if (hs > as) {
      homeTeam.won++; homeTeam.pts += 3
      awayTeam.lost++
    } else if (hs < as) {
      awayTeam.won++; awayTeam.pts += 3
      homeTeam.lost++
    } else {
      homeTeam.drawn++; homeTeam.pts += 1
      awayTeam.drawn++; awayTeam.pts += 1
    }
  })

  Object.keys(standings).forEach(group => {
    standings[group].sort((a, b) =>
      b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
    )
  })

  return standings
}

export function getBestThirdPlace(standings) {
  const thirds = Object.entries(standings)
    .map(([group, teams]) => ({ ...teams[2], group }))
    .filter(t => t.played > 0)
    .sort((a, b) =>
      b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
    )
  return thirds.slice(0, 8)
}
