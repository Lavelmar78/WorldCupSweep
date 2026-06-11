// Fetches finished 2026 World Cup group results from football-data.org
// and writes them into Firebase. Knockout rounds stay manual (bracket
// confirmation happens in the app).

const API_KEY = process.env.FOOTBALL_DATA_API_KEY
const DB_URL = process.env.FIREBASE_DATABASE_URL

// Map football-data.org team names to our app's team names
const NAME_MAP = {
  'Korea Republic': 'South Korea',
  'South Korea': 'South Korea',
  'Czech Republic': 'Czechia',
  'Czechia': 'Czechia',
  'Türkiye': 'Turkiye',
  'Turkey': 'Turkiye',
  'Cabo Verde': 'Cape Verde',
  'Cape Verde Islands': 'Cape Verde',
  'Curaçao': 'Curacao',
  'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  'Bosnia-Herzegovina': 'Bosnia & Herzegovina',
  "Côte d'Ivoire": 'Ivory Coast',
  'Ivory Coast': 'Ivory Coast',
  'Congo DR': 'DR Congo',
  'DR Congo': 'DR Congo',
  'United States': 'USA',
  'USA': 'USA',
  'IR Iran': 'Iran',
  'Iran': 'Iran',
}

function mapName(name) {
  return NAME_MAP[name] || name
}

// Same group fixtures as src/data.js — IDs must match
const FIXTURES = [
  { id: 'A1', home: 'Mexico', away: 'South Africa' },
  { id: 'A2', home: 'South Korea', away: 'Czechia' },
  { id: 'A3', home: 'Mexico', away: 'South Korea' },
  { id: 'A4', home: 'Czechia', away: 'South Africa' },
  { id: 'A5', home: 'Czechia', away: 'Mexico' },
  { id: 'A6', home: 'South Africa', away: 'South Korea' },
  { id: 'B1', home: 'Canada', away: 'Bosnia & Herzegovina' },
  { id: 'B2', home: 'Qatar', away: 'Switzerland' },
  { id: 'B3', home: 'Canada', away: 'Qatar' },
  { id: 'B4', home: 'Switzerland', away: 'Bosnia & Herzegovina' },
  { id: 'B5', home: 'Switzerland', away: 'Canada' },
  { id: 'B6', home: 'Bosnia & Herzegovina', away: 'Qatar' },
  { id: 'C1', home: 'Brazil', away: 'Morocco' },
  { id: 'C2', home: 'Haiti', away: 'Scotland' },
  { id: 'C3', home: 'Scotland', away: 'Morocco' },
  { id: 'C4', home: 'Brazil', away: 'Haiti' },
  { id: 'C5', home: 'Morocco', away: 'Haiti' },
  { id: 'C6', home: 'Scotland', away: 'Brazil' },
  { id: 'D1', home: 'USA', away: 'Paraguay' },
  { id: 'D2', home: 'Australia', away: 'Turkiye' },
  { id: 'D3', home: 'USA', away: 'Australia' },
  { id: 'D4', home: 'Turkiye', away: 'Paraguay' },
  { id: 'D5', home: 'Turkiye', away: 'USA' },
  { id: 'D6', home: 'Paraguay', away: 'Australia' },
  { id: 'E1', home: 'Germany', away: 'Curacao' },
  { id: 'E2', home: 'Ivory Coast', away: 'Ecuador' },
  { id: 'E3', home: 'Germany', away: 'Ivory Coast' },
  { id: 'E4', home: 'Ecuador', away: 'Curacao' },
  { id: 'E5', home: 'Ecuador', away: 'Germany' },
  { id: 'E6', home: 'Curacao', away: 'Ivory Coast' },
  { id: 'F1', home: 'Netherlands', away: 'Japan' },
  { id: 'F2', home: 'Sweden', away: 'Tunisia' },
  { id: 'F3', home: 'Netherlands', away: 'Sweden' },
  { id: 'F4', home: 'Tunisia', away: 'Japan' },
  { id: 'F5', home: 'Japan', away: 'Sweden' },
  { id: 'F6', home: 'Tunisia', away: 'Netherlands' },
  { id: 'G1', home: 'Belgium', away: 'Egypt' },
  { id: 'G2', home: 'Iran', away: 'New Zealand' },
  { id: 'G3', home: 'Belgium', away: 'Iran' },
  { id: 'G4', home: 'New Zealand', away: 'Egypt' },
  { id: 'G5', home: 'Egypt', away: 'Iran' },
  { id: 'G6', home: 'New Zealand', away: 'Belgium' },
  { id: 'H1', home: 'Spain', away: 'Cape Verde' },
  { id: 'H2', home: 'Saudi Arabia', away: 'Uruguay' },
  { id: 'H3', home: 'Spain', away: 'Saudi Arabia' },
  { id: 'H4', home: 'Uruguay', away: 'Cape Verde' },
  { id: 'H5', home: 'Cape Verde', away: 'Saudi Arabia' },
  { id: 'H6', home: 'Uruguay', away: 'Spain' },
  { id: 'I1', home: 'France', away: 'Senegal' },
  { id: 'I2', home: 'Iraq', away: 'Norway' },
  { id: 'I3', home: 'France', away: 'Iraq' },
  { id: 'I4', home: 'Norway', away: 'Senegal' },
  { id: 'I5', home: 'Norway', away: 'France' },
  { id: 'I6', home: 'Senegal', away: 'Iraq' },
  { id: 'J1', home: 'Argentina', away: 'Algeria' },
  { id: 'J2', home: 'Austria', away: 'Jordan' },
  { id: 'J3', home: 'Argentina', away: 'Austria' },
  { id: 'J4', home: 'Jordan', away: 'Algeria' },
  { id: 'J5', home: 'Algeria', away: 'Austria' },
  { id: 'J6', home: 'Jordan', away: 'Argentina' },
  { id: 'K1', home: 'Portugal', away: 'DR Congo' },
  { id: 'K2', home: 'Uzbekistan', away: 'Colombia' },
  { id: 'K3', home: 'Portugal', away: 'Uzbekistan' },
  { id: 'K4', home: 'Colombia', away: 'DR Congo' },
  { id: 'K5', home: 'Colombia', away: 'Portugal' },
  { id: 'K6', home: 'DR Congo', away: 'Uzbekistan' },
  { id: 'L1', home: 'England', away: 'Croatia' },
  { id: 'L2', home: 'Ghana', away: 'Panama' },
  { id: 'L3', home: 'England', away: 'Ghana' },
  { id: 'L4', home: 'Panama', away: 'Croatia' },
  { id: 'L5', home: 'England', away: 'Panama' },
  { id: 'L6', home: 'Croatia', away: 'Ghana' },
]

function findFixture(home, away) {
  // Match in either home/away order, since sources can differ
  return FIXTURES.find(f =>
    (f.home === home && f.away === away) ||
    (f.home === away && f.away === home)
  )
}

async function fbGet(path) {
  const res = await fetch(`${DB_URL}/${path}.json`)
  return res.json()
}

async function fbPut(path, data) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Firebase write failed: ${path} ${res.status}`)
}

async function updateTeamGroupResult(teamName, fixtureId, result, scored, conceded) {
  const group = (await fbGet(`teamPoints/${teamName}/group`)) || []
  const filtered = group.filter(r => r && r.fixtureId !== fixtureId)
  filtered.push({ result, scored, conceded, fixtureId })
  await fbPut(`teamPoints/${teamName}/group`, filtered)
}

async function main() {
  if (!API_KEY || !DB_URL) {
    console.error('Missing FOOTBALL_DATA_API_KEY or FIREBASE_DATABASE_URL')
    process.exit(1)
  }

  console.log('Fetching finished World Cup matches...')
  const res = await fetch(
    'https://api.football-data.org/v4/competitions/WC/matches?status=FINISHED',
    { headers: { 'X-Auth-Token': API_KEY } }
  )

  if (!res.ok) {
    console.error(`API error: ${res.status} ${await res.text()}`)
    process.exit(1)
  }

  const data = await res.json()
  const matches = data.matches || []
  console.log(`Found ${matches.length} finished matches`)

  const existing = (await fbGet('fixtureResults')) || {}
  let written = 0

  for (const m of matches) {
    // Only handle group stage automatically
    if (m.stage !== 'GROUP_STAGE') continue

    const home = mapName(m.homeTeam?.name || '')
    const away = mapName(m.awayTeam?.name || '')
    const fixture = findFixture(home, away)

    if (!fixture) {
      console.log(`No fixture match for: ${home} vs ${away}`)
      continue
    }

    // Skip if already recorded
    if (existing[fixture.id] && existing[fixture.id].homeScore !== undefined) continue

    const ft = m.score?.fullTime
    if (!ft || ft.home === null || ft.away === null) continue

    // Align scores to our fixture's home/away orientation
    let hs = ft.home
    let as = ft.away
    if (fixture.home === away) {
      hs = ft.away
      as = ft.home
    }

    console.log(`Writing ${fixture.id}: ${fixture.home} ${hs}-${as} ${fixture.away}`)
    await fbPut(`fixtureResults/${fixture.id}`, { homeScore: hs, awayScore: as })

    const homeResult = hs > as ? 'W' : hs < as ? 'L' : 'D'
    const awayResult = as > hs ? 'W' : as < hs ? 'L' : 'D'
    await updateTeamGroupResult(fixture.home, fixture.id, homeResult, hs, as)
    await updateTeamGroupResult(fixture.away, fixture.id, awayResult, as, hs)
    written++
  }

  console.log(`Done. Wrote ${written} new results.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
